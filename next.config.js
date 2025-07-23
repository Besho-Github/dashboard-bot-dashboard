/** @type {import('next').NextConfig} */
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const baseURL = isDev ? 'http://localhost:3001' : 'https://wicks.bot'; //http://localhost:3001

  const nextConfig = {
    reactStrictMode: false,
    env: {
      LOGIN_URL: `${baseURL}/api/auth/discord`,
      API_URL: `${baseURL}/api`,
      INVITE_URL: `${baseURL}/api/auth/invite`,
      MEDIA_DOMAIN: 'media.wicks.bot',
      ADMIN_ID: '',
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'media.wicks.bot',
        },
        {
          protocol: 'https',
          hostname: 'cdn.wick-studio.com',
        },
      ],
    },
    // Enhance webpack configuration
    webpack: (config, { isServer, dev }) => {
      if (isServer) {
        // Skip canvas on the server side
        config.externals.push({
          canvas: 'canvas',
          'canvas-prebuilt': 'canvas-prebuilt',
        });
      }
      config.resolve.alias.canvas = false;
      return config;
    },
  };

  return nextConfig;
};
