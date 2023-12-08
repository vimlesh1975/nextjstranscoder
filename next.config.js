// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const webpack = require('webpack');

module.exports = {
  webpack: (config, { isServer }) => {
    // Add your plugins here
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.FLUENTFFMPEG_COV': JSON.stringify(false),
      })
    );

    // Add any other webpack configurations if needed

    return config;
  },
};
