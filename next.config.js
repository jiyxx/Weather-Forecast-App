/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    // Disable Webpack persistent cache in development to avoid
    // occasional ENOENT rename errors on Windows.
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;

