/**
 * Created by Kurt on 2017-03-10.
 */
// src/utils/xioup.main.utils.js

// import libraries
import m from './m-mock'
import * as R__ from './xioup.ramda'
import R from 'ramda'
import * as L from 'partial.lenses'
// import uuidV4 from 'uuid/v4'

// config
const apiUrlRoot = 'http://rem-rest-api.herokuapp.com/api'

// debug stuff
const log = R__.tap( console.log )
const composeLog = f => g => ( ...h ) =>
  logWithMsg( 'f' )( f( logWithMsg( 'g' )( g( logWithMsg( 'h' )( ...h ) ) ) ) )
const logWithMsg = msg =>
  R__.tap( R__.compose( R.apply( console.log ) )( R__.compose( R.prepend( msg ) )( list ) ) )
const logCall = fn => ( ...a ) => R__.tap( R__.compose( console.log )( R.call( fn ) ) )( ...a )

// array functions
const list = R.unapply( R__.identity )
const appendTo = R__.flip( R.append )
const _sortAsc = R__.compose( R.sort )( R.ascend )
const sortAscByProp = R__.compose( _sortAsc )( L.get )
const joinOnSpace = R.join( ' ' )
const joinOnDot = R.join( '.' )

// object functions
const mapObj = L.modify( L.values )
const freeze = Object.freeze

// comparison and data type functions
const notEquals = R__.complement( R__.equals )
const isUndefined = a => typeof a === 'undefined'
const isNotUndefined = R__.complement( isUndefined )
const isFunction = R__.is( Function )
const isNotFunction = R__.complement( isFunction )

// function functions
// not sure why ! can't get the following to work with my ifElse
const applyUnary =
  R.reduce( R__.ifElse( isFunction )
                  ( R.call )
                  ( R.reduced )
          )
const applyUnaryTo = R__.flip( applyUnary )

// anchor href functions
const showRowHref = a => b => `/${ R.toLower( a ) }/${ b.id }`
const editRowHref = a => b => `/${ R.toLower( a ) }/${ b.id }/edit`

// mithril component functions
const m2 = x => y => m( x, y )
const m3 = x => y => z => m( x, y )

const X =
  { apiUrlRoot
  , log
  , composeLog
  , logCall
  , list
  , appendTo
  , sortAscByProp
  , joinOnSpace
  , joinOnDot
  , mapObj
  , freeze
  , notEquals
  , isUndefined
  , isNotUndefined
  , isFunction
  , isNotFunction
  , applyUnary
  , applyUnaryTo
  , showRowHref // tested
  , editRowHref // tested
  , m2
  , m3
  }

module.exports = X
