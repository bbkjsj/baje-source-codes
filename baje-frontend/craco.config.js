const CracoLessPlugin = require('craco-less');
const webpack = require('webpack');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: { // Preserving original options
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Ensure resolve and resolve.fallback exist
      if (!webpackConfig.resolve) {
        webpackConfig.resolve = {};
      }
      if (!webpackConfig.resolve.fallback) {
        webpackConfig.resolve.fallback = {};
      }

      // Polyfills for Node.js core modules
      webpackConfig.resolve.fallback.stream = require.resolve("stream-browserify");
      webpackConfig.resolve.fallback.buffer = require.resolve("buffer/");
      webpackConfig.resolve.fallback.process = require.resolve("process/browser");
      webpackConfig.resolve.fallback.zlib = require.resolve("browserify-zlib");
      webpackConfig.resolve.fallback.path = require.resolve("path-browserify");
      webpackConfig.resolve.fallback.crypto = require.resolve("crypto-browserify");
      webpackConfig.resolve.fallback.http = require.resolve("stream-http");
      webpackConfig.resolve.fallback.https = require.resolve("https-browserify");
      webpackConfig.resolve.fallback.os = require.resolve("os-browserify/browser");
      webpackConfig.resolve.fallback.vm = require.resolve("vm-browserify");
      webpackConfig.resolve.fallback.assert = require.resolve("assert/");


      // Provide Buffer and process globally
      webpackConfig.plugins = [
        ...(webpackConfig.plugins || []),
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
      ];

      // Ensure module.rules exists for .mjs rule
      if (!webpackConfig.module) {
        webpackConfig.module = {};
      }
      if (!webpackConfig.module.rules) {
        webpackConfig.module.rules = [];
      }

      const mjsRule = {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      };

      const ruleExists = webpackConfig.module.rules.some(
        rule => rule.test && rule.test.toString() === mjsRule.test.toString()
      );
      if (!ruleExists) {
        webpackConfig.module.rules.push(mjsRule);
      }

      return webpackConfig;
    }
  }
};
