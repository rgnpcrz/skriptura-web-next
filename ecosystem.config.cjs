// PM2 process definition for self-hosting skriptura-web-next.
// Usage (on the server):
//   pm2 start ecosystem.config.cjs
//   pm2 save && pm2 startup   # persist across reboots
module.exports = {
  apps: [
    {
      name: 'skriptura-web',
      // Run the Next server binary directly so PM2 owns the Node process
      // (clean restarts, signal handling) instead of an `npm` wrapper.
      script: './node_modules/next/dist/bin/next',
      args: 'start',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        // NOTE: PORT cannot live in .env (Next boots the HTTP server before it
        // reads .env). Set it here — PM2 injects it as a real env var. Either
        // edit the fallback below, or run: PORT=8080 pm2 start ecosystem.config.cjs
        PORT: process.env.PORT || '3000',
        // Bind to localhost only — your Apache reverse proxy is the public entrypoint.
        HOSTNAME: '127.0.0.1',
      },
    },
  ],
}
