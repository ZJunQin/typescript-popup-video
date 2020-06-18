const path = require('path');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const dev = {
    mode: 'development',
    devServer: {
        host: 'localhost',
        port: 8009,
        contentBase: '/dist',
        open: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: [
                    path.resolve(__dirname, 'src/components')
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', {
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
    }
}

module.exports = merge(commonConfig, dev);