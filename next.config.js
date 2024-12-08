// next.config.js
module.exports = {
  reactStrictMode: true,
  distDir: ".next", // This specifies the directory where build files will be stored
  images: {
    domains: ["example.com"], // If you're using any external image sources
  },
  // Add other Next.js-specific settings here as needed
};
