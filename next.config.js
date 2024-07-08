module.exports = {
  webpack: (config, { isServer, buildId }) => {
    // Enable WebAssembly experiments
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Conditionally add file-loader configuration for .wasm files
    if (process.env.USE_FILE_LOADER_FOR_WASM === 'true') {
      config.module.rules.push({
        test: /\.wasm$/,
        type: "javascript/auto",
        loader: "file-loader",
        options: {
          publicPath: '/_next/static/wasm/',
          outputPath: 'static/wasm/',
          name: '[name].[hash].[ext]',
        }
      });
    }

    // Ensure config.plugins array exists
    if (!config.plugins) {
      config.plugins = [];
    }

    return config;
  },
  async headers() {
    return [
      {
        source: "/static/wasm/:path*",
        headers: [
          {
            key: "Content-Type",
            value: "application/wasm",
          },
        ],
      },
    ];
  },
};