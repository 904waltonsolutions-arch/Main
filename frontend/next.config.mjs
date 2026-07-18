/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the marketing site can be hosted for free on
  // Azure Static Web Apps (or any static host / Azure Storage static website).
  // All routes are static; the contact form calls the backend API over HTTPS.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
