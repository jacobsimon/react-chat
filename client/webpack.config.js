module.exports = {
  entry: './src/index.js',
  output: {
     path: './build',
     filename: 'react-chat-client.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss/,
        loader: 'style!css!sass'
      },
      {
        test: /\.(png|svg)$/,
        loader: 'url-loader'
      }
    ]
  }
}
