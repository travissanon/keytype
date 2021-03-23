const path = require("path");
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    mode: 'development',
    watch: true,
    plugins: [new ESLintPlugin()],
    entry: "./src/index.ts",
    module: {
    rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        {
            test: /\.(scss|css)$/,
            use: [
                // Creates `style` nodes from JS strings
                "style-loader",
                // Translates CSS into CommonJS
                "css-loader",
                {
                    loader: "sass-loader",
                    options: {
                        // Prefer `dart-sass`
                        implementation: require("sass"),
                        sassOptions: {
                            fiber: false
                        }
                    }
                }
            ]
        }
    ],
    },
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['.ts', '.tsx', '.js', '.scss', '.css'],
        alias: {
            "@utils": path.resolve(__dirname, 'src/scripts/utilities'),
            "@api": path.resolve(__dirname, 'src/scripts/api'),
            "@components": path.resolve(__dirname, 'src/scripts/components'),
            "@styles": path.resolve(__dirname, 'src/styles')
        }
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
};
