module.exports = {
  webpack: (config, { isServer, buildId }) => {
    // Enable WebAssembly experiments
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },

};