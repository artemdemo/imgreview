const { DefinePlugin } = require('webpack');
const WebpackChunkHash = require('webpack-chunk-hash');
const webpackCommonFactory = require('./webpack.common');

/**
 * @param options {Object} - see required params in `webpackCommon.js`
 */
module.exports = (options) => {
    const webpackCommon = webpackCommonFactory(options);
    return Object.assign(webpackCommon, {
        mode: 'production',

        // RIP CommonsChunkPlugin
        // https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
        optimization: {
            minimize: true,
            splitChunks: {
                chunks: 'async',
                minSize: 30000,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                name: true,
                cacheGroups: {
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                    },
                },
            },
        },
        plugins: webpackCommon.plugins.concat([

            // @docs https://webpack.js.org/guides/caching/
            new WebpackChunkHash(),

            new DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"',
                },
            }),
        ]),
    });
};
