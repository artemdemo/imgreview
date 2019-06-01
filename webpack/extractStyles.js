const ExtractTextPlugin = require('extract-text-webpack-plugin');

const moduleRule = (extract = false) => {
    const rule = {
        test: /\.(less|css)$/,
        use: null,
    };
    if (extract) {
        rule.use = ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
                { loader: 'css-loader', options: { importLoaders: 1 } },
                'less-loader',
            ],
        });
    } else {
        rule.use = [
            'style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'less-loader',
        ];
    }
    return rule;
};

const plugins = (extract = false, isProduction = false) => {
    if (extract) {
        return [
            new ExtractTextPlugin({
                filename: isProduction ?
                    './css/styles-[hash].css' :
                    './css/styles.css',
                disable: false,
                allChunks: true,
            }),
        ];
    }
    return [];
};

module.exports = {
    moduleRule,
    plugins,
};
