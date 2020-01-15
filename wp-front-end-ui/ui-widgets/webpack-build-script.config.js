const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopywebpackPlugin = require('copy-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// The path to the cesium source code
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';
const olSource = 'node_modules/openlayers/src/ol';


const buildConfig = (options, entry, app_name, enableCesium = false) => {
    const devtool_val = options.mode == 'development' ? 'source-map' : '';
    const output_dir = path.resolve(__dirname, '../../' + app_name + '/static/components');
    let cesiumPlugin = [];
    if (enableCesium) {
        const cesiumSource = 'node_modules/cesium/Source';
        const cesiumWorkers = '../Build/Cesium/Workers';
        const olSource = 'node_modules/openlayers/src/ol';
        cesiumPlugin = [
            // Copy Cesium Assets, Widgets, and Workers to a static directory
            new CopywebpackPlugin([{from: path.join(cesiumSource, cesiumWorkers), to: '../Cesium/Workers'}]),
            new CopywebpackPlugin([{from: path.join(cesiumSource, 'Assets'), to: '../Cesium/Assets'}]),
            new CopywebpackPlugin([{from: path.join(cesiumSource, 'Widgets'), to: '../Cesium/Widgets'}]),
            new webpack.DefinePlugin({
                // Define relative base path in cesium for loading assets
                CESIUM_BASE_URL: JSON.stringify('/static/components/Cesium')
            }),
        ]
    }
    return {
        entry: entry,
        devtool: devtool_val,
        output: {
            filename: '[name].bundle.js',
            chunkFilename: '[name].bundle.js',
            path: output_dir + "/js/",
            publicPath: '/static/components/js/',
            // Needed by Cesium for multiline strings
            sourcePrefix: ''
        },
        amd: {
            // Enable webpack-friendly use of require in cesium
            toUrlUndefined: true
        },
        node: {
            // Resolve node module use of fs
            fs: "empty"
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
            alias: {
                // Cesium module name
                cesium: path.resolve(__dirname, cesiumSource),
            }
        },
        module: {
            rules: [
                {
                    // Remove pragmas
                    test: /\.js$/,
                    // enforce: 'pre',
                    exclude: /node_modules/,
                    // include: path.resolve(__dirname, cesiumSource),
                    use: {loader: "babel-loader"}
                },
                {
                    test: /\.tsx?$/,
                    loader: 'awesome-typescript-loader'
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', {
                        loader: 'css-loader',
                        // options: {
                        //     // Minify css
                        //     minimize: true
                        // }
                    }]
                },
                {
                    test: /\.(png|gif|jpe?g|svg|xml|json)$/,
                    use: {
                        loader: 'url-loader',
                    },
                },
                {
                    test: /\.pug$/,
                    loader: 'pug-loader'
                }
            ]
        },
        optimization: {
            minimize: true,
            // runtimeChunk: {
            //     name: entrypoint => `runtimechunk~${entrypoint.name}`
            // }
        },
        plugins: [
            ...cesiumPlugin,
            new CopywebpackPlugin([{from: './static/components/', to: output_dir}]),

            // new webpack.optimize.UglifyJsPlugin()
            // new webpack.optimize.splitChunks({
            //     name: 'cesium',
            //     minChunks: module => module.context && module.context.indexOf('cesium') !== -1
            // })
        ],
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            // 'jquery': '$'
        },
        mode: options.mode
    }
}
module.exports = buildConfig;