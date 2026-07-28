/** @type {import('next').NextConfig} */
const nextConfig = {
  // Generates fully static HTML — serves from any Node.js/nginx host
  // Remove this line if you want server-side rendering on every request instead
  // output: 'export',

  // nodemailer opens raw SMTP sockets and resolves transports at runtime — leave
  // it to Node's own `require` instead of bundling it into /api/contact.
  serverExternalPackages: ['nodemailer'],
}

export default nextConfig
