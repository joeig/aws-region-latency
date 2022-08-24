'use strict';

const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js']
    },
    entry: './src/index.ts',
    output: {
        path: path.resolve('./dist'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Region Latency Meter',
            filename: 'index.html',
            template: './src/assets/index.ejs',
            meta: {
                viewport: 'width=device-width, initial-scale=1',
                robots: 'noindex'
            }
        })
    ]
};
