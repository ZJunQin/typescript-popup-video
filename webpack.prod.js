const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const prod = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
                exclude: [
                    path.resolve(__dirname, 'src/components')
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: '[name]__[hash:base64:5]'
                        }
                    }
                }],
                include: [
                    path.resolve(__dirname, 'src/components')
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin()
    ]
}

module.exports = merge(commonConfig, prod);