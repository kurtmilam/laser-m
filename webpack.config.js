/**
 * Created by Kurt on 2017-03-09.
 */
const path = require( 'path' )

module.exports = {
  entry: './src/index.js',
  output: {
    path: './bin',
    filename: 'app.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  resolve: {
    extensions: [ '.js', '.jsx' ],
    modules: [ 'node_modules', 'src', 'components', 'utils' ]
  }
}
