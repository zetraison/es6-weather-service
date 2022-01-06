const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

    mode: 'development',
    
    entry: {
        app: './src/index.js'
    },
    
    output: { 
        filename: 'bundle.js',
        path: path.join(__dirname, 'public'), 
        sourceMapFilename: '[file].map',
        publicPath: "/"
    },

    module: {
        rules: [
            {
                test: /.js?$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react'
                    ],
                    plugins: [
                        '@babel/transform-runtime', 
                        "@babel/transform-async-to-generator"
                    ]
                  }
                }
            },
            { 
                test: /\.css$/, 
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/index.html', to: 'index.html' },
                { from: './src/images', to: 'images' },
                { from: './src/css', to: 'css' },
                { from: './src/favicon.ico', to: './' },
                { from: './src/fixtures', to: './fixtures' },
            ]
        })
    ],

    devtool: 'inline-source-map',

    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
            publicPath: "/"
        },
        port: 3000,
        hot: true,
        allowedHosts: 'all',
        historyApiFallback: true
    }
};