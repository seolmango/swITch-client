import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WebpackPwaManifest from "webpack-pwa-manifest";
import {GenerateSW} from "workbox-webpack-plugin";
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import webpack from 'webpack';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import os from 'os';

export default (env, argv) => {
    const isProduction = argv.mode === 'production';
    const isAnalysis = argv.mode === 'analysis';

    return {
        mode: isProduction ? 'production' : 'development',
        entry: './src/index.ts',
        output: {
            filename: isProduction ? 'bundle_[contenthash].js' : 'bundle.js',
            path: path.resolve(__dirname, './dist'),
            clean: true,
            assetModuleFilename: 'assets/[name][ext]',
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|webp|ico)$/i,
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 8 * 1024
                        }
                    }
                },
                {
                    test: /\.(woff|woff2|ttf|otf|eot)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name][ext]'
                    }
                },
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: 'ts-loader',
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env'
                            ]
                        }
                    }
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/index.html",
                filename: "index.html",
                favicon: "./src/assets/favicon.ico",
            }),
            new MiniCssExtractPlugin({
                filename: "style.css",
                chunkFilename: "[id].css"
            }),
            new WebpackPwaManifest({
                name: "swITch.io",
                short_name: "swITch",
                description: "Runaway from the tagger!",
                background_color: "#ffffff",
                theme_color: "#7FDFFF",
                display: "standalone",
                start_url: ".",
                publicPath: '/',
                fingerprints: true,
                inject: true,
                ios: true,
                orientation: "landscape",
                icons: [
                    {
                        src: path.resolve(__dirname, './src/assets/icon_512.webp'),
                        sizes: [96, 128, 192, 256, 384, 512],
                        destination: path.join('assets', 'icons'),
                        purpose: 'any'
                    },
                    {
                        src: path.resolve(__dirname, './src/assets/icon_512.webp'),
                        sizes: [512],
                        destination: path.join('assets', 'icons'),
                        purpose: 'maskable'
                    }
                ]
            }),
            isProduction && new GenerateSW({
                swDest: 'sw.js',
                clientsClaim: true,
                skipWaiting: true,
                runtimeCaching: [
                    {
                        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|mp3|wav|ogg|json|webp|woff2)$/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'game-assets-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 30 * 24 * 60 * 60,
                            },
                        },
                    },
                ],
            }),
            new webpack.DefinePlugin({
                __SERVER_URL__: "https://localhost:3000",
                __IS_DEVELOPMENT__: !isProduction,
                __BUILD_VERSION__: JSON.stringify(new Date().toISOString()),
                __BUILD_ENV__: JSON.stringify(process.platform + "-" + process.arch + "(" + os.hostname() + "," + os.release() + ")")
            }),
            isAnalysis && new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                openAnalyzer: true
            })
        ].filter(Boolean),
        devServer: {
            static: './dist',
            port: 5000,
            hot: true,
            open: true,
        }
    }
}