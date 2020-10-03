const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const moment = require('moment');
const path = require('path');
const {
    IgnorePlugin,
    DefinePlugin,
} = require('webpack');
const {
    ModuleConcatenationPlugin,
} = require('webpack').optimize;
const extractStyles = require('./extractStyles');
const fontLoaders = require('./fontLoaders');
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;

const MAIN_SRC_PATH = './src';

const styledComponentsTransformer = createStyledComponentsTransformer();

/**
 * @param options {Object}
 * @param options.isProduction {Boolean}
 * @param options.buildFolder {String}
 * @param options.appVersion {String}
 * @param options.extractStylesFile {Boolean}
 */
module.exports = (options) => {
    return {
        entry: {
            bundle: `${MAIN_SRC_PATH}/index.jsx`,
        },
        output: {
            path: `${process.cwd()}`,

            // @docs https://webpack.js.org/guides/caching/#deterministic-hashes
            filename: options.isProduction ?
                `${options.buildFolder}/js/[name]-[chunkhash].js` :
                `${options.buildFolder}/js/[name].js`,
            chunkFilename: options.isProduction ?
                `${options.buildFolder}/js/[id].chunk-[chunkhash].js` :
                `${options.buildFolder}/js/[id].chunk.js`,
            publicPath: '/',
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            alias: {
                roughjs: path.resolve('./node_modules/roughjs/bundled/rough.cjs'),
            }
        },
        module: {
            rules: [
                {
                    test: /\.([tj])sx?$/,
                    exclude: /node_modules/,
                    use: [{
                        loader: 'ts-loader',
                        options: {
                            getCustomTransformers: () => {
                                const transformersBefore = [];
                                if (!options.isProduction) {
                                    // This transformer will add component name to the generated class.
                                    // It will make it easier to investigate the DOM.
                                    // @link https://www.npmjs.com/package/typescript-plugin-styled-components
                                    transformersBefore.push(styledComponentsTransformer);
                                }
                                return {
                                    before: transformersBefore,
                                };
                            },
                        },
                    }],
                },

                extractStyles.moduleRule(options.extractStylesFile),

                {test: /\.(png|gif|jpg)(\?.*$|$)/, use: 'url-loader?limit=100000&name=images/[hash].[ext]'},

                ...fontLoaders,
            ],
        },
        plugins: [
            // ModuleConcatenationPlugin
            // * faster build
            // * faster execution time in the browser
            // @link https://webpack.js.org/plugins/module-concatenation-plugin/
            new ModuleConcatenationPlugin(),

            // Ignoring warnings for following plugins, case they doesn't matter
            new IgnorePlugin(/regenerator|nodent|js-beautify/, /ajv/),

            // Defining global ENV variable
            new DefinePlugin({
                ENV: {production: options.isProduction},
            }),

            new HtmlWebpackPlugin({
                template: `${MAIN_SRC_PATH}/index.ejs`,
                filename: './index.html',
                appVersion: options.appVersion,
                appBuildDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                isProduction: options.isProduction,
            }),

            new HtmlWebpackPlugin({
                template: `${MAIN_SRC_PATH}/changed-path.ejs`,
                filename: `${options.buildFolder}/index.html`,
            }),

            // new CleanWebpackPlugin({
            //     // verbose: true,
            //     dry: false,
            //     cleanOnceBeforeBuildPatterns: [
            //         `${options.buildFolder}/**/*`,
            //         `${options.buildFolder}/!.gitignore`,
            //     ],
            // }),

            new CopyPlugin({
                patterns: [
                    {
                        from: `${MAIN_SRC_PATH}/favicon.ico`,
                        to: `${options.buildFolder}`,
                    },
                    {
                        from: `${MAIN_SRC_PATH}/favicon.png`,
                        to: `${options.buildFolder}`,
                    },
                ],
            }),

            ...extractStyles.plugins(options.extractStylesFile, options.isProduction),
        ],
    };
};
