const path = require('path');

module.exports = {
    entry: './src/js/pc.js',
    mode:'development',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    }
};