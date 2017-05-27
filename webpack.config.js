var webpack = require('webpack'),
    autoprefixer = require('autoprefixer'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
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
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader?modules&camelCase&importLoaders=1&localIdentName=[local]__[hash:base64:5]!postcss-loader!sass-loader'
            },
            {
                test: /\.css$/,
                exclude: path.resolve(__dirname, './src'),
                loader: 'style-loader!css-loader?camelCase&importLoaders=1&localIdentName=[local]__[hash:base64:5]!postcss-loader'
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, './src'),
                loader: 'style-loader!css-loader?modules&camelCase&importLoaders=1&localIdentName=[local]__[hash:base64:5]!postcss-loader'
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loaders: [
                    'react-hot',
                    'babel-loader'
                ]
            },
            {test: /\.json$/, loader: 'json-loader'},
            {test: /\.tpl$/, loader: 'html-tpl?minimize=false&collapseWhitespace=false'},
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
        new webpack.optimize.CommonsChunkPlugin('lib', 'lib.js'),
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development') }
        }),
        new CopyWebpackPlugin([
        { from: './../static', to: './../dist' },
        ]),
        new HtmlWebpackPlugin({
            template: './index.html'
        })
    ],
    devServer: {
        stats: { chunks:false },
        contentBase: './src',
        hot: true
    }
}
