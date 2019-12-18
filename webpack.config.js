const path = require('path');
const webpack = require('webpack');

const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  const hotCssLoader = isProd ? null : 'css-hot-loader';
  const miniCssLoader = MiniCssExtractPlugin.loader;
  const postCssLoader = isProd ? {
    loader: 'postcss-loader',
    options: {
      plugins: () => [
        require('autoprefixer'),
        require('cssnano')({ preset: 'default' }),
      ],
      sourceMap: true,
    },
  } : null;

  return {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    stats: 'minimal',

    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      hot: true,
      port: 9000,
    },

    entry: {
      main: './src/index.ts',
    },

    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.css', '.scss', '.sass'],
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new CopyPlugin([
        { from: './src/index.html', to: './index.html' },
        { from: './src/manifest.json', to: './manifest.json' },
      ]),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new CleanWebpackPlugin(),
    ],

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
        },
        {
          test: /\.js$/,
          use: 'source-map-loader',
          exclude: /\bnode_modules\b/,
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            hotCssLoader,
            miniCssLoader,
            'css-loader',
            postCssLoader,
            'sass-loader',
          ].filter(loader => loader != null),
        },
        {
          test: /\.css$/,
          use: [
            hotCssLoader,
            miniCssLoader,
            'css-loader',
            postCssLoader,
          ].filter(loader => loader != null),
        },
      ],
    },
  };
};
