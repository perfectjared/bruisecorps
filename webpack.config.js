const path = require('path');
const DIST_DIR = path.resolve(__dirname, 'dist');

module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'phaser3-rex-plugins': path.resolve(__dirname, 'node_modules/phaser3-rex-plugins')
    }
  },
  output: {
    filename: 'app.js',
    path: DIST_DIR
  },
  devServer: {
    static: '.'
  },
  devtool: 'eval-source-map'
};
