/**
 * Created by Kurt on 2017-04-11.
 */

// import libraries
import * as L from 'partial.lenses'
import * as R from './xioup.ramda'
import * as X from './xioup.main.utils'


const rowByIdL = rowsL => id =>
  X.appendTo( rowsL )
            ( L.find( R.whereEq( { id } ) ) )

const getRowL = rowsL =>
  R.compose( rowByIdL( rowsL ) )
           ( Number )

const O =
  { rowByIdL
  , getRowL
  }

module.exports = O