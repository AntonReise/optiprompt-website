/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(jsx|tsx)$/,
      exclude: [/node_modules/],
      use: [{
        loader: '@dhiwise/component-tagger/nextLoader',
      }],
    });
    return config;
  },
  // Allow cross-origin requests from the specified domain
  allowedDevOrigins: [
    'antonsap3734.builtwithrocket.new'
  ],
};
export default nextConfig;