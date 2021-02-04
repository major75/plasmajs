const path = require('path');

module.exports = {
    entry: {
        plasmajs_api: './src/plasmajs-api.ts',
        plasmajs_jsonrpc: './src/rpc-web.ts',
        plasmajs_jssig: './src/plasmajs-jssig.ts',
        plasmajs_numeric: './src/plasmajs-numeric.ts',
    },
    devtool: 'inline-source-map',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.web.json'
                    }
                },
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: x => x.chunk.name.replace('_', '-') + '-debug.js',
        library: '[name]',
        path: path.resolve(__dirname, 'dist-web', 'debug'),
    }
};
