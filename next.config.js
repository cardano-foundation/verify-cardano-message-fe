const path = require('path');

module.exports = {
  webpack: (config, { isServer }) => {
    // Enable WebAssembly experiments
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Resolve WebAssembly modules
    config.resolve.alias = {
      ...config.resolve.alias,
      '@emurgo/cardano-serialization-lib-nodejs': path.resolve(
        __dirname,
        'node_modules/@emurgo/cardano-serialization-lib-nodejs'
      ),
    };

    // Customize WebAssembly output
    if (!isServer) {
      config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    }

    // Add Node.js polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      crypto: false,
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
    };

    return config;
  },
};