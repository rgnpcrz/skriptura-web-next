# Deploying skriptura-web-next (outside Vercel)

This is a **server-rendered** Next.js 16 app, not a static site. It **cannot** be
deployed as a pure static export (`output: 'export'`) because it uses:

- `src/proxy.js` — locale detection & `/` → `/en` `/sq` redirects (needs the request)
- `src/app/[lang]/opengraph-image.js` — the OG image is generated on the server

So it needs a **Node.js process** running `next start`. Everything below assumes a
Linux VPS (DigitalOcean, Hetzner, a Contabo box, etc.).

## Requirements

- **Node.js ≥ 20.9.0** (`node -v`)
- npm (or pnpm/yarn)
- A reverse proxy — **Apache** (`mod_proxy`) or nginx in front, so Next only
  renders and the proxy handles TLS, malformed requests, rate limiting, etc.

> ### The port cannot go in `.env`
> Next boots its HTTP server **before** it loads `.env`, so `PORT` in `.env` is
> ignored (this is documented Next.js behaviour). Set the port via the `-p` flag
> or a real environment variable instead — the PM2 config below does this for you.
> Everything else (`NEXT_PUBLIC_*`, API keys, …) can still live in `.env`.

---

## Option A — VPS with PM2 + nginx (recommended)

### 1. Build on the server

```bash
git clone <your-repo> /var/www/skriptura-web-next
cd /var/www/skriptura-web-next
npm ci
npm run build
```

### 2. Run it with PM2

PM2 keeps the app alive (auto-restart on crash), starts it on reboot, and gives
you logs. A ready-made config lives at [`ecosystem.config.cjs`](./ecosystem.config.cjs)
(fork mode, 1 instance, bound to `127.0.0.1:3000`).

```bash
npm i -g pm2
pm2 start ecosystem.config.cjs
pm2 save            # snapshot the process list
pm2 startup         # print the command to run so PM2 relaunches on boot
```

Handy commands:

```bash
pm2 logs skriptura-web      # tail logs
pm2 restart skriptura-web   # after a new build
pm2 reload skriptura-web    # zero-downtime reload
pm2 monit                   # live dashboard
```

> **Why fork mode / 1 instance?** The whole site is prerendered at build time
> (no ISR / on-demand revalidation), so there's no server-side cache to keep in
> sync across workers. One process is plenty for a brochure site; scale with
> more instances only if traffic demands it.

### 3. Put Apache in front (reverse proxy + TLS)

Enable the proxy modules once:

```bash
a2enmod proxy proxy_http headers
```

VirtualHost (adjust `3000` to match the PORT you set in the PM2 config):

```apache
<VirtualHost *:80>
    ServerName skriptura.net
    ServerAlias www.skriptura.net

    ProxyPreserveHost On
    ProxyPass        / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    # Tell Next the original scheme (set to "https" inside the :443 vhost)
    RequestHeader set X-Forwarded-Proto "http"
</VirtualHost>
```

```bash
apachectl configtest && systemctl reload apache2   # or `httpd` on RHEL/CentOS
certbot --apache -d skriptura.net -d www.skriptura.net   # free HTTPS
```

> - `ProxyPreserveHost On` keeps the real `Host` header so canonical URLs stay
>   correct. Apache forwards `Accept-Language` by default, so Next's locale
>   detection works — **don't** replicate the `/` → `/en` redirect in Apache;
>   let Next handle it.
> - Inside the HTTPS (`:443`) vhost that certbot creates, set
>   `RequestHeader set X-Forwarded-Proto "https"`.

### Deploying an update

```bash
git pull && npm ci && npm run build && pm2 reload skriptura-web
```

---

## Contact form email (Postfix)

The form is a two-step flow, and the first step is never gated:

| When | Email | To |
| --- | --- | --- |
| On submit | inquiry alert, marked **unverified** | the notification inboxes |
| On submit | 6-digit verification code | the visitor |
| On correct code | confirmation quoting their message | the visitor, **BCC** the inboxes |

So the lead reaches you the moment it's sent; the BCC arriving later is what tells
you the address is real. A visitor who ignores the code costs you nothing.

Config lives in `.env` (copy [`.env.example`](./.env.example)):

```bash
MAIL_TYPE=LOCAL                  # hand off to Postfix on 127.0.0.1:25
MAIL_FROM=hello@skriptura.net
MAIL_FROM_NAME=Skriptura
CONTACT_BCC=skriptura.net@gmail.com, rgnpcrz@gmail.com
CONTACT_CODE_SECRET=<32 random bytes, hex>
```

`CONTACT_CODE_SECRET` keys the HMAC that protects stored codes. **Set it.** Unset,
the app logs a warning and falls back to a per-process key, so every code in
flight is invalidated by a restart. Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`MAIL_TYPE=SMTP` switches to an authenticated external host instead
(`MAIL_HOST` / `MAIL_PORT` / `MAIL_SECURE` / `MAIL_USER` / `MAIL_PASS`) — the same
scheme `skriptura-hotel-api` uses. Any other value disables sending and logs a
warning, so a typo fails loudly rather than silently dropping mail.

`.env` is read at boot: **`pm2 restart skriptura-web --update-env` after editing it.**

### Server checklist

1. Postfix listens on loopback and accepts mail from the app:

   ```bash
   postconf inet_interfaces          # expect: loopback-only (or all)
   postconf mydestination
   systemctl status postfix
   ```

2. **Gate the rollout on this one.** Postfix may send as `hello@skriptura.net`,
   and DNS backs that up. Without SPF/DKIM/DMARC alignment the code email lands
   in spam — and a visitor staring at a form asking for a code that never arrived
   is worse than no verification at all:

   ```bash
   dig +short TXT skriptura.net       # v=spf1 ... a mx ~all, including this server's IP
   dig +short TXT default._domainkey.skriptura.net   # DKIM, if opendkim is set up
   dig +short TXT _dmarc.skriptura.net
   ```

   Then send one real submission to a Gmail address and use *Show original* to
   confirm `SPF: PASS`, `DKIM: PASS`, `DMARC: PASS` before announcing the form.

3. Smoke-test the whole path once the site is live:

   ```bash
   curl -X POST https://skriptura.net/api/contact \
     -H 'Content-Type: application/json' \
     -d '{"name":"Test","email":"you@example.com","message":"hello","lang":"en"}'
   # → {"ok":true,"token":"...","expiresIn":600}

   curl -X POST https://skriptura.net/api/contact/verify \
     -H 'Content-Type: application/json' \
     -d '{"token":"<from above>","code":"<from your inbox>"}'
   # → {"ok":true,"confirmationSent":true}

   tail -f /var/log/mail.log     # Postfix's own view of the handoff
   pm2 logs skriptura-web        # "[Mailer] Sent ... Message ID: ..."
   ```

### The inquiry database

Submissions are stored in SQLite at `data/skriptura.db` (override with `DATA_DIR`),
created on first write. It holds the verification state and doubles as the lead log.

```bash
sqlite3 data/skriptura.db \
  "SELECT datetime(created_at/1000,'unixepoch') AS at, name, email,
          CASE WHEN verified_at IS NULL THEN 'unverified' ELSE 'verified' END AS status
     FROM inquiries ORDER BY id DESC LIMIT 20;"
```

- `data/` must be writable by the PM2 user. It survives `git pull` and `npm ci`,
  and is gitignored.
- `better-sqlite3` ships prebuilt binaries for common Linux/x64. If `npm ci`
  falls back to compiling, install `build-essential` and `python3` once.
- Back it up with SQLite's own command — the database runs in WAL mode, so a
  plain `cp` of the `.db` file can capture a torn state:

  ```bash
  sqlite3 data/skriptura.db ".backup '/var/backups/skriptura-$(date +%F).db'"
  ```

- **Retention:** unverified inquiries older than 30 days are deleted
  automatically on the next write; verified ones are kept as the lead log. Storing
  names, emails and messages makes you a data controller under Kosovo's LMBPD —
  the form carries a short retention note, and this is the mechanism behind it.

### Abuse protection

The endpoints are public, so they carry a honeypot field, length caps, a
CR/LF guard on `name`/`email`, and these budgets (all in
[`src/lib/contact/inquiries.js`](src/lib/contact/inquiries.js)):

| Limit | Value |
| --- | --- |
| Submissions per IP | 3 per 10 minutes |
| Codes per email address | 3 per hour |
| Resend cooldown | 60 seconds |
| Wrong-code attempts | 5, then the code is destroyed |
| Code lifetime | 10 minutes, single use |

The IP budget reads `X-Forwarded-For` — the reverse proxy must set it (Apache's
`mod_proxy` does by default), otherwise every visitor shares one bucket and the
fourth message site-wide in any ten-minute window gets a 429. Counters live in
SQLite now, so unlike the previous in-memory limiter they survive `pm2 reload`.

---

## Option B — Docker (standalone output)

For a container/Kubernetes/PaaS flow, add `output: 'standalone'` to
`next.config.mjs`, which emits a self-contained `.next/standalone/server.js`
with only the files it needs:

```js
const nextConfig = { output: 'standalone' }
```

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

Run it the same way behind nginx (or hand it to Fly.io, Render, Google Cloud Run,
DigitalOcean App Platform — all support Docker).

---

## Option C — managed platforms (no server to babysit)

These have their own Next.js integrations — push the repo and they build/run it:

- **Netlify**, **Cloudflare Workers**, **Render**, **Railway**, **AWS Amplify**,
  **Firebase App Hosting**, **Deno Deploy**

Feature support varies by provider (proxy/middleware + the dynamic OG image are
the things to sanity-check on the free tiers).

---

## After it's live (SEO)

1. Add the domain in [Google Search Console](https://search.google.com/search-console)
   and submit `https://skriptura.net/sitemap.xml`.
2. Confirm `https://skriptura.net/robots.txt` and `/sitemap.xml` resolve publicly.
3. Spot-check that `/` redirects to `/en`, and that `/en` / `/sq` both return 200.
