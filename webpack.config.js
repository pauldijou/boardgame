var path = require('path');

module.exports = {
  entry: './demo/scripts.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'scripts.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'demo'),
  }
};
