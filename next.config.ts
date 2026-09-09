/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Tells Next.js to output a static 'out' folder
  images: {
    unoptimized: true, // GitHub Pages doesn't support the default image optimization server
  },
  allowedDevOrigins: [`127.0.0.1`],
};

module.exports = nextConfig;
