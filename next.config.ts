/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Tells Next.js to output a static 'out' folder
  images: {
    unoptimized: true, // GitHub Pages doesn't support the default image optimization server
  },
};


module.exports = nextConfig;