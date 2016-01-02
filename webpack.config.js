var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    context: path.join(__dirname, 'frontend'), 
    
    entry: './src/app',
    
    output: { 
        path: path.join(__dirname, 'public'), 
        filename: 'bundle.js',
        publicPath: '/',
        sourceMapFilename: '[file].map'
    },
    
    resolve: {
        modulesDirectories: ['node_modules', 'frontend/src'],
        extensions: ['', '.js']
    },
    
    module: {
        loaders: [{
            test: /.js?$/,
            loaders: ['babel?presets[]=es2015&presets[]=react'],
            include: path.join(__dirname, 'frontend/src'),
            exclude: path.join(__dirname, 'node_modules')
        }]
    },
    
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new webpack.DefinePlugin({
            NODE_ENV:   JSON.stringify(NODE_ENV),
            LANG:       JSON.stringify('ru')
        }),
        new CopyWebpackPlugin([
            { from: './index.html', to: 'index.html' },
            { from: './resources/images', to: 'images' },
            { from: './style', to: 'css' }
        ])
    ],
    
    devtool: NODE_ENV == 'development' ? 'cheap-inline-module-source-map' : null,
    watch: NODE_ENV == 'development',
};

if (NODE_ENV == 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings:       false,
                drop_console:   true,
                unsafe:         true
            }
        })
    )
};