module.exports = {
  webpack: (config, { isServer, buildId }) => {
    // Enable WebAssembly experiments
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Adjust file-loader configuration for .wasm files for Netlify compatibility
    if (process.env.USE_FILE_LOADER_FOR_WASM === 'true') {
      config.module.rules.push({
        test: /\.wasm$/,
        type: "javascript/auto",
        loader: "file-loader",
        options: {
          // Adjust paths for Netlify deployment
          publicPath: 'static/wasm/',
          outputPath: 'out/_next/static/wasm/', // Adjusted for Netlify's output directory
          name: '[name].[hash].[ext]',
        }
      });
    }

    // Ensure config.plugins array exists
    if (!config.plugins) {
      config.plugins = [];
    }

    // Add any Netlify-specific plugins or configurations here if needed

    return config;
  },
  async headers() {
    return [
      {
        // Adjust the source path if necessary for Netlify
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