var webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    autoprefixer = require('autoprefixer'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    path = require('path')

module.exports = {
    context: path.join(__dirname, './src'),
    entry: {
        app: './index.jsx',
        lib: [
            'react',
            'react-dom',
            'react-redux',
            'react-router',
            'react-router-redux',
            'redux'
        ]
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].[chunkhash:5].js',
        publicPath: 'http://fecdn.qeebike.com/repo/swallow/'
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&minimize&camelCase&importLoaders=1&localIdentName=[local]__[hash:base64:5]!postcss-loader!sass-loader')
            },
            {
                test: /\.css$/,
                exclude: path.resolve(__dirname, './src'),
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?minimize&camelCase&importLoaders=1&localIdentName=[local]__[hash:base64:5]!postcss-loader')
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, './src'),
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&minimize&camelCase&importLoaders=1&localIdentName=[local]__[hash:base64:5]!postcss-loader')
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loaders: [
                    'react-hot',
                    'babel-loader'
                ]
            },
            {test: /\.tpl$/, loader: 'html-tpl?minimize=false&collapseWhitespace=false'},
            {test: /\.json$/, loader: 'json-loader'},
            {test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192&name=[name]_[hash:5].[ext]'},
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            }, {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias: {
          'react': path.join(__dirname, 'node_modules', 'react')
        }
    },
    postcss: [
        autoprefixer({
            browsers: [ 'Android >= 4', 'iOS > 6', 'last 10 Chrome versions', 'last 4 Firefox versions', 'Safari >= 6', 'ie > 8' ]
        })
    ],
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('lib', 'lib.[chunkhash:5].js'),
        new ExtractTextPlugin("[name].[chunkhash:5].css"),
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development') }
        }),
        new CopyWebpackPlugin([
            { from: './../static', to: './../dist' },
        ]),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            unused: false,
            dead_code: false,
            warnings: false
        }),
        new HtmlWebpackPlugin({
            minify: {},
            template: './index.html'
        })
    ]
}
