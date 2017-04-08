/**
 * Created by Kurt on 2017-03-10.
 */
// src/utils/xioup.main.utils.js

// import libraries
import m from './m-mock'
import R from 'ramda'
import * as L from 'partial.lenses'
import flyd from 'flyd'
// import uuidV4 from 'uuid/v4'

// config
const apiUrlRoot = 'http://rem-rest-api.herokuapp.com/api'

// low level
const compose = f => g => h => f( g( h ) )
const tap = fn => a => {
  fn( a )
  return a
}
const log = tap( console.log )
const logCompose = f => g => h =>
  logWithMsg( 'f' )( f( logWithMsg( 'g' )( g( logWithMsg( 'h' )( h ) ) ) ) )
const logWithMsg = msg =>
  tap( compose( R.apply( console.log ) )( compose( R.prepend( msg ) )( list ) ) )
const logCall = fn => a => tap( compose( console.log )( R.call( fn ) ) )( a )

const list = R.unapply( R.identity )
const map = L.modify( L.elems )
const mapObj = L.modify( L.values )
// like R.identity
const I = a => a
// like R.always
const K = a => _ => a


const freeze = Object.freeze

const appendTo = R.flip( R.append )

const complement = R.complement
const equals = R.equals
const notEquals = complement( equals )
const not = a => !a
// const complement = f => compose( not )( f ) // not working - have to lift it
// is is copied from https://github.com/ramda/ramda/blob/v0.23.0/src/is.js
const is = Ctor => a =>
  a != null && a.constructor === Ctor || a instanceof Ctor
const isUndefined = a => typeof a === 'undefined'
const isNotUndefined = R.complement( isUndefined )
const isFunction = is( Function )
const isNotFunction = R.complement( isFunction )

const ifElse = f => g => h => a =>
  f( a ) ? g( a ) : h( a )
const when = f => g => a =>
  ifElse( f )( g )( I )( a )

const flip = fn => a => b => fn( b )( a )

// not working
const converge = f => gs => h => compose( R.apply( f ) )
                                        ( R.map( gs, list( h ) ) )

// not sure why I can't get the following to work with my ifElse
const applyUnary =
  R.reduce( R.ifElse( isFunction )
                    ( R.call )
                    ( R.reduced )
          )
const applyUnaryTo = flip( applyUnary )

const joinOnSpace = R.join( ' ' )
const joinOnDot = R.join( '.' )

// anchor href functions
const showRowHref = a => b => `/${ R.toLower( a ) }/${ b.id }`
const editRowHref = a => b => `/${ R.toLower( a ) }/${ b.id }/edit`

// mithril component functions
const m2 = x => y => m( x, y )
const m3 = x => y => z => m( x, y )

const sortAsc = compose( R.sort )( R.ascend )
const sortByProp = compose( sortAsc )( L.get )

// vnode functions
const getAttrs = L.get( 'attrs' )

// makeStateContainer operations
const view = lens => $ => L.get( lens, $() )
const viewOn = $ => lens => view( lens )( $ )

// For instance:
// const list = makeStateContainer(['models','users','list'], {})
// const modifyList = X.updateOn( list, [] )
// modifyList( R.map( R.overOn( R.lensProp( 'firstName' ), R.toLower) ) )
// modifyList( R.overOn( R.lensPath( [ 0, 'firstName' ] ), R.toUpper ) )

const over = lens => fn => $ =>
  R.compose( R.tap( $ )
           , freeze
           , L.modify( lens, fn )
           , R.call  
           )( $ )
const overOn = $ => lens => fn => over( lens )( fn )( $ )

const set = lens => value => $ =>
  R.compose( R.tap( $ )
           , freeze
           , L.set( lens, value )
           , R.call
           )( $ )
const set$ = lens => value => $ =>
  compose( $, set( lens )( value ) )( $ )
const setOn = $ => lens => value => set( lens )( value )( $ )

// convenience function that can be called with a function or value
const update = lens => value =>
  isFunction( value )
    ? over( lens )( value )
    : set( lens )( value )
const updateOn = $ => lens => value => update( lens )( value )( $ )

const emptyStream = lens => over( lens )( R.empty )

const lensedAtom = function ( lens, $, init ) {
  const withAtom = applyUnaryTo( [ $, lens ] )
  // const stream$ = flyd.stream( init )
  if ( typeof withAtom( viewOn ) === 'undefined' )
    withAtom( setOn )( init )

  // I had a hard time trying to make the following point-free
  return a =>
    R.ifElse( isUndefined
            , _ => withAtom( viewOn )
            , compose( L.get( lens ) )( withAtom( setOn ) )
            // , freeze( L.get( lens, withAtom( setOn )( a ) ) ) // ??
            )( a )

}
// not sure why the following aren't working (for instance, in UserEdit)
// const _lensedAtom = R.curry( _lensedAtom )
// const _lensedAtom = lens => $ => init => _lensedAtom( lens, $, init )

function makeStateContainer( $ ) {
  return function ( lens, init ) {
    // return a lensedAtom on [ 'data' ] in the state stream if no arguments are supplied
    if( isUndefined( lens ) ) {
      return lensedAtom( [ 'data' ], $, {} )
    }
    const streamsL = compose( R.pair( 'streams' ) )( joinOnDot )
    const getLensedStream$ = compose( view )( streamsL )( lens )

    const dataL = R.prepend( [ 'data' ] )
    const setData = compose( setOn( $ ) )( dataL )
    
    const makeUpdaterStream =
      R.tap( flyd.on( when( isNotUndefined )
                          ( setData( lens ) )
                    )
           )

    const registerLensedStream = compose( setOn( $ ) )( streamsL )

    const addToMain$ =
      R.compose( R.tap( registerLensedStream( lens ) )
               , flyd.stream
               , R.tap( setData( lens ) )
               )

    const makeLensed$ = compose( makeUpdaterStream )( addToMain$ )

    const lensedStream$ =
      compose( flyd.isStream )( getLensedStream$ )( $ )
        ? getLensedStream$( $ )
        : makeLensed$( init )

    return lensedStream$
  }
}

// node functions
const _getEventAttr = attrName => e =>
  attrName in e.currentTarget
    ? e.currentTarget[ attrName ]
    : e.currentTarget.getAttribute( attrName )

// setOn may be appropriate here because _getEventAttr is waiting for the event
const setToAttr = attrName => lens => $ =>
  R.compose( setOn( $ )( lens )
           , _getEventAttr( attrName )
           )

const setToValueAttr = setToAttr( 'value' )

const bindS = attrName => evtName => lens => atom => (
  { [ evtName ]: setToAttr( attrName )( lens )( atom )
  , [ attrName ]: X.view( lens )( atom )
  }
)

const bindSOn = attrName => evtName => atom => lens =>
  bindS( attrName )
       ( evtName )
       ( when( isUndefined )
             ( _ => [] )
             ( lens )
       )
       ( atom )

// api model functions
const dataContainerSpec =
  { id: L.get( 'id' )
  , children: []
  , computed: {}
  , data: freeze
  , rowType: K( 'e.g. users, people' )
  , ui: {}
  }
const initDataContainer = compose( freeze )( R.applySpec )( dataContainerSpec )
const putDataInContainer = compose( map( initDataContainer ) )( L.get( [ 'data' ] ) )
const freezeDataContainer = compose( freeze )( putDataInContainer )

// TODO: Make it possible to send in a preprocessor / reducer (for instance, for sorting)
const loadTableFromApi = apiUrl => _ =>
  m.request( { method: "GET"
             , url: apiUrl
             , withCredentials: true
             }
          )
  .then( freezeDataContainer )


// TODO: Make it possible to send in a preprocessor / reducer (for instance, for normalization)
const loadRowFromApi = apiUrl => $ => id =>
  m.request( { method: "GET"
             , url: apiUrl
             , data: { id }
             , withCredentials: true
             }
           )
  .then( compose( $, initDataContainer ) )

// TODO: Make it possible to send in a preprocessor / reducer (for instance, for validation)
const saveRowToApi = apiUrl => $ => data =>
  m.request( { method: "PUT"
             , url: apiUrl
             , data: data
             , withCredentials: true
             }
           )
  .then( setOn( $ )( [ 'data' ] ) )

const X =
  { apiUrlRoot
  , compose
  , tap
  , log
  , logCompose
  , logCall
  , list
  , map
  , mapObj
  , I
  , K
  , freeze
  , appendTo
  , complement
  , equals
  , notEquals
  , not
  , is
  , isUndefined
  , isNotUndefined
  , isFunction
  , isNotFunction
  , ifElse
  , when
  // , converge // not working
  , applyUnary
  , applyUnaryTo
  , joinOnSpace
  , joinOnDot
  , showRowHref // tested
  , editRowHref // tested
  , m2
  , m3
  , loadTableFromApi
  , loadRowFromApi
  , saveRowToApi
  , getAttrs
  , view // tested
  , viewOn // tested
  , over // tested
  // , over$
  , overOn // tested
  , set // tested
  , set$
  , setOn // tested
  , update // tested
  , updateOn // tested
  , setToAttr
  , setToValueAttr
  , bindS
  , bindSOn
  , emptyStream // tested
  , makeStateContainer // tested
  , lensedAtom // partially tested
  , sortByProp
  }

module.exports = X

