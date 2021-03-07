const path = require("path");

module.exports = {
    mode: 'development',
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
        extensions: ['.ts', '.js', '.scss', '.css'],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
};
