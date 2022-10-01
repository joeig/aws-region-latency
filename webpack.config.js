'use strict';

const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { LicenseWebpackPlugin } = require('license-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js']
    },
    entry: './src/index.ts',
    output: {
        path: path.resolve('./dist'),
        filename: '[name].[contenthash].js'
    },
    optimization: {
        runtimeChunk: 'single'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
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
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),
        new LicenseWebpackPlugin({
            outputFilename: 'licenses.txt'
        })
    ]
};
