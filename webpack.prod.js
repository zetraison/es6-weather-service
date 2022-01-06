const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

    mode: 'production',
    
    entry: {
        app: './src/index.js'
    },
    
    output: { 
        filename: 'bundle.js',
        path: path.join(__dirname, 'public'), 
        sourceMapFilename: '[file].map',
        clean: true
    },

    module: {
        rules: [
            {
                test: /.js?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                        [
                            '@babel/preset-env', 
                            {
                                "targets": {
                                    "node": "10.0.0"
                                }
                            }
                        ],
                        '@babel/preset-react'
                    ],
                    plugins: [
                        '@babel/plugin-transform-runtime', 
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
                { from: './src/favicon.ico', to: './' },
                { from: './src/css', to: 'css' }
            ]
        })
    ]
};
