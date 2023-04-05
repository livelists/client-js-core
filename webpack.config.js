const path = require('path');


module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: "umd",
        clean: true
    },
    resolve: {
        extensions: ['.ts', '.tsx'],
        alias: {
            'node_modules': path.join(__dirname, 'node_modules'),
        }
    },
    externals: {
        react: 'react',
        protobufjs: 'protobufjs',
        'protobufjs/minimal': 'protobufjs',
        events: 'events',
    },
    module: {
        rules: [
            {
                test: /\.css/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(ts|tsx)?$/,
                use: ['ts-loader'],
                exclude: /node_modules/
            }
        ],
    }
}
