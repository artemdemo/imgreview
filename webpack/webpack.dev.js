const webpackCommonFactory = require('./webpack.common');
const proxy = require('./proxy');

/**
 * @param options {Object} - see required params in `webpackCommon.js`
 */
module.exports = (options) => {
    const webpackCommon = webpackCommonFactory(options);
    return Object.assign(webpackCommon, {
        mode: 'development',
        devtool: 'source-map',
        optimization: {
            minimize: false,
        },
        devServer: {
            host: '0.0.0.0',
            port: 8080,
            contentBase: `${options.buildFolder}/`,
            historyApiFallback: true,
            proxy,
        },
        plugins: [
            ...webpackCommon.plugins,
        ],
    });
};
