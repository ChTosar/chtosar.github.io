const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyCSS: true,
                minifyJS: true,
                minifyURLs: true,
            },
            inject: 'body',
            scriptLoading: 'blocking',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'docs', to: 'docs' }, 
                { from: 'icon', to: 'icon' },
                { from: 'imgs', to: 'imgs' },
                { from: 'lang', to: 'lang' },
                { from: 'music', to: 'music' },
                { from: 'CNAME', to: '' }
            ]
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
};