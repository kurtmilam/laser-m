/**
 * Created by Kurt on 2017-03-10.
 */
// src/utils/xioup.main.utils.js

// import libraries
import m from './m-mock'
import * as R from './xioup.ramda'
import * as L from 'partial.lenses'
// import uuidV4 from 'uuid/v4'

// config
const apiUrlRoot = 'http://rem-rest-api.herokuapp.com/api'

// anchor href functions
const showRowHref = a => b => `/${ R.toLower( a ) }/${ b.id }`
const editRowHref = a => b => `${ showRowHref( a )( b ) }/edit`

// mithril component functions
const m2 = x => y => m( x, y )
const m3 = x => y => z => m( x, y )

// array functions
const list = R.unapply( R.identity )
const appendTo = R.flip( R.append )
const _sortAsc = R.compose( R.sort )( R.ascend )
const sortAscByProp = R.compose( _sortAsc )( L.get )

// object functions
const mapObj = L.modify( L.values )
const freeze = Object.freeze

// comparison and data type functions
const notEq = R.complement( R.equals )
const isDef = a => typeof a !== 'undefined'
const notDef = R.complement( isDef )
const isFn = R.is( Function )
const notFn = R.complement( isFn )

// function functions
// not sure I had trouble getting the following to work with my ifElse
const applyUnary =
  R.reduce( R.ifElse( isFn )
                  ( R.call )
                  ( R.reduced )
          )
const applyUnaryTo = R.flip( applyUnary )

// string functions
const joinOnDot = R.join( '.' )
const joinL = a => L.rewrite( R.join( a ) )
const firstToUpper = L.modify( [ joinL( '' ), 0 ], R.toUpper )

// debug stuff
const log = R.tap( console.log )
const composeLog = f => g => ( ...h ) =>
  logWithMsg( 'f' )( f( logWithMsg( 'g' )( g( logWithMsg( 'h' )( ...h ) ) ) ) )
const logWithMsg = msg =>
  R.tap( R.compose( R.apply( console.log ) )( R.compose( R.prepend( msg ) )( list ) ) )
const logCall = fn => ( ...a ) => R.tap( R.compose( console.log )( R.call( fn ) ) )( ...a )

const X =
  { apiUrlRoot
  , showRowHref // tested
  , editRowHref // tested
  , m2
  , m3
  , list
  , appendTo
  , sortAscByProp
  , mapObj
  , freeze
  , notEq
  , isDef
  , notDef
  , isFn
  , notFn
  , applyUnary
  , applyUnaryTo
  , joinOnDot
  , joinL
  , firstToUpper
  , log
  , composeLog
  , logCall
  }

module.exports = X
