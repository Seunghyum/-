const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    filename: 'main.bundle.js',
    path: join(__dirname, '../dist'),
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['*', '.js'],
    alias: {
      '~src': join(__dirname, '../src'),
      '~api': join(__dirname, '../src/api'),
      '~utils': join(__dirname, '../src/utils'),
      '~pages': join(__dirname, '../src/pages'),
      '~store': join(__dirname, '../src/store'),
      '~components': join(__dirname, '../src/components'),
    },
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: join(__dirname, '../public/index.html'),
    }),
    new MiniCssExtractPlugin(),
    new FaviconsWebpackPlugin({
      logo: join(__dirname, '../public/favicon.png'),
      mode: 'light',
    }),
  ],
};
