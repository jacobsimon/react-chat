module.exports = {
  entry: './src/index.jsx',
  output: {
     path: './build',
     filename: 'react-chat-client.js',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
}
