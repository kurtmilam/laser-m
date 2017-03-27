/**
 * Created by Kurt on 2017-03-09.
 */
const path = require( 'path' )
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve( 'bin' ),
    filename: 'app.js',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  resolve: {
    extensions: [ '.js', '.jsx' ],
    modules: [ 'node_modules', 'src', 'components', 'utils' ]
  }
}
