const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = require('webpack');
const path = require('path');
const packageFile = require('./package.json');
const fontLoaders = require('./webpack/fontLoaders');

const isProduction = process.env.NODE_ENV === 'production';
const isGhPages = process.env.GH_PAGES === 'true';
const configOptions = {
  buildFolder: isGhPages ? './' : './build',
  mainSrcPath: './src',
  appVersion: packageFile.version,
  clientId: process.env.CLIENT_ID,
  apiKey: process.env.API_KEY,
  isProduction,
};

module.exports = () => {
  return {
    entry: path.join(__dirname, configOptions.mainSrcPath, 'index.tsx'),
    mode: configOptions.isProduction ? 'production' : 'development',
    output: {
      path: `${process.cwd()}/${configOptions.buildFolder}`,
      filename: configOptions.isProduction
        ? './js/[name]-[chunkhash].js'
        : './js/[name].js',
      chunkFilename: configOptions.isProduction
        ? './js/[id].chunk-[chunkhash].js'
        : './js/[id].chunk.js',
      publicPath: '/',
    },
    ...(isProduction ? {} : { devtool: 'eval-source-map' }),
    devServer: {
      host: '0.0.0.0',
      port: 4001,
      static: {
        directory: path.join(__dirname, configOptions.buildFolder),
      },
      historyApiFallback: true,
      hot: true,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.([tj])sx?$/,
          include: path.resolve(__dirname, configOptions.mainSrcPath),
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {},
            },
          ],
        },
        {
          test: /\.(less|css)$/,
          use: [
            'style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'less-loader',
          ],
        },
        // {
        //   test: /\.css$/i,
        //   include: path.resolve(__dirname, configOptions.mainSrcPath),
        //   exclude: /node_modules/,
        //   use: [
        //     'style-loader',
        //     {
        //       loader: 'css-loader',
        //       options: {
        //         importLoaders: 1
        //       }
        //     },
        //     'postcss-loader',
        //   ]
        // },
        {
          test: /\.(png|gif|jpg)(\?.*$|$)/,
          use: 'url-loader?limit=100000&name=images/[hash].[ext]',
        },

        ...fontLoaders,
      ],
    },
    plugins: [
      // Defining global ENV variable
      // Useful for some age cases, when you need explicitly know whether you're in development or not
      // For example, when you want to log out something only in development mode
      // and don't want to delete this code in production, just want to deactivate it then.
      new DefinePlugin({
        ENV: {
          production: configOptions.isProduction,
        },
      }),

      // ModuleConcatenationPlugin
      // * faster build
      // * faster execution time in the browser
      // @link https://webpack.js.org/plugins/module-concatenation-plugin/
      // new ModuleConcatenationPlugin(),

      new HtmlWebpackPlugin({
        template: `${configOptions.mainSrcPath}/index.ejs`,
        filename: './index.html',
        appVersion: configOptions.appVersion,
        appBuildDate: new Date().toISOString(),
        isProduction: configOptions.isProduction,
        buildFolder: configOptions.buildFolder,
      }),

      new CleanWebpackPlugin({
        verbose: true,
        dry: false,
        cleanOnceBeforeBuildPatterns: isGhPages
          ? [
              './js/**/*',
              './css/**/*',
              './*.html',
              './about/*.html',
              './*.ico',
              './*.png',
            ]
          : ['./**/*', '!./.gitignore'],
      }),

      new CopyPlugin({
        patterns: [
          {
            from: `${configOptions.mainSrcPath}/favicon.ico`,
            to: './',
          },
          {
            from: `${configOptions.mainSrcPath}/favicon.png`,
            to: './',
          },
        ],
      }),
    ],
  };
};
