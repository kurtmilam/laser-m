/**
 * Created by Kurt on 2017-03-10.
 */
// src/utils/xioup.main.utils.js

// import libraries
import m from './m-mock'
import * as R__ from './xioup.ramda'
import R from 'ramda'
import * as L from 'partial.lenses'
import flyd from 'flyd'
// import uuidV4 from 'uuid/v4'

// config
const apiUrlRoot = 'http://rem-rest-api.herokuapp.com/api'

// debug stuff
const log = R__.tap( console.log )
const composeLog = f => g => h =>
  logWithMsg( 'f' )( f( logWithMsg( 'g' )( g( logWithMsg( 'h' )( h ) ) ) ) )
const logWithMsg = msg =>
  R__.tap( R__.compose( R.apply( console.log ) )( R__.compose( R.prepend( msg ) )( list ) ) )
const logCall = fn => a => R__.tap( R__.compose( console.log )( R.call( fn ) ) )( a )

const list = R.unapply( R__.identity )

const mapObj = L.modify( L.values )


const freeze = Object.freeze

const appendTo = R__.flip( R.append )

const notEquals = R__.complement( R__.equals )
const isUndefined = a => typeof a === 'undefined'
const isNotUndefined = R__.complement( isUndefined )
const isFunction = R__.is( Function )
const isNotFunction = R__.complement( isFunction )

// not sure why ! can't get the following to work with my ifElse
const applyUnary =
  R.reduce( R__.ifElse( isFunction )
                  ( R.call )
                  ( R.reduced )
          )
const applyUnaryTo = R__.flip( applyUnary )

const joinOnSpace = R.join( ' ' )
const joinOnDot = R.join( '.' )

// anchor href functions
const showRowHref = a => b => `/${ R.toLower( a ) }/${ b.id }`
const editRowHref = a => b => `/${ R.toLower( a ) }/${ b.id }/edit`

// mithril component functions
const m2 = x => y => m( x, y )
const m3 = x => y => z => m( x, y )

const sortAsc = R__.compose( R.sort )( R.ascend )
const sortAscByProp = R__.compose( sortAsc )( L.get )

// vnode functions
const getAttrs = L.get( 'attrs' )

// makeStateContainer operations
const view = lens => $ => L.get( lens, $() )
const viewOn = $ => lens => view( lens )( $ )

// For instance:
// const list = makeStateContainer(['models','users','list'], {})
// const modifyList = X.updateOn( list, [] )
// modifyList( R__.map( R.overOn( R.lensProp( 'firstName' ), R.toLower) ) )
// modifyList( R.overOn( R.lensPath( [ 0, 'firstName' ] ), R.toUpper ) )

const saveHistory = R__.identity // logWithMsg( 'history' )
// TODO: Only update if the new value != the old value?
// dispatcher for L.modify and L.get
const _dispatch = action => updateStream => lens => a => $ =>
  R__.compose( R__.compose( updateStream )
                  ( freeze )
         )
         ( R__.compose( L[ action ]( lens, a ) )
                  ( saveHistory )
         )
         ( $() )

const setAndReturn$ = $ =>
  R__.compose( R__.always( $ ) )
         ( $ )

// over starts here
const _dispatchModify = _dispatch( 'modify' )

const over = lens => a => $ =>
  _dispatchModify( R__.tap( $ ) )
                 ( lens )
                 ( a )
                 ( $ )
const overOn = $ => lens => a =>
  over( lens )
      ( a )
      ( $ )

const over$ = lens => a => $ =>
  _dispatchModify( setAndReturn$( $ ) )
                 ( lens )
                 ( a )
                 ( $ )
const overOn$ = $ => lens => a =>
  over$( lens )
       ( a )
       ( $ )

// set starts here
const _dispatchSet = _dispatch( 'set' )

const set = lens => a => $ =>
  _dispatchSet( R__.tap( $ ) )
              ( lens )
              ( a )
              ( $ )
const setOn = $ => lens => a =>
  set( lens )
     ( a )
     ( $ )

const set$ = lens => a => $ =>
  _dispatchSet( setAndReturn$( $ ) )
              ( lens )
              ( a )
              ( $ )
const setOn$ = $ => lens => a =>
  set$( lens )
      ( a )
      ( $ )

const emptyStream = lens => over( lens )( R.empty )

const lensedAtom = function ( lens, $, init ) {
  const withAtom = applyUnaryTo( [ $, lens ] )
  // const stream$ = flyd.stream( init )
  if ( typeof withAtom( viewOn ) === 'undefined' )
    // The following change isn't really tested. The tested version is commented out
    withAtom( setOn$ )( init )
    // withAtom( setOn )( init )

  // I had a hard time trying to make the following point-free
  // Also having trouble making it work with my ifElse
  return a =>
    R.ifElse( isUndefined
            , _ => withAtom( viewOn )
            , withAtom( setOn$ )
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
      // return $
    }
    const streamsL = R__.compose( R.pair( 'streams' ) )( joinOnDot )
    const getLensedStream$ = R__.compose( view )( streamsL )( lens )

    const dataL = R.prepend( [ 'data' ] )
    const setData = R__.compose( setOn( $ ) )( dataL )
    
    const makeUpdaterStream =
      R__.tap( flyd.on( R__.when( isNotUndefined )
                          ( setData( lens ) )
                    )
           )

    const registerLensedStream = R__.compose( setOn( $ ) )( streamsL )

    const addToMain$ =
      R__.compose( R__.tap( registerLensedStream( lens ) ) )
                        ( R__.compose( flyd.stream )
                                     ( R__.tap( setData( lens ) ) )
                        )

    const makeLensed$ = R__.compose( makeUpdaterStream )( addToMain$ )

    const lensedStream$ =
      R__.compose( flyd.isStream )
             ( getLensedStream$ )( $ )
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
  R__.compose( setOn$( $ )( lens ) )
         ( _getEventAttr( attrName ) )

const setToValueAttr = setToAttr( 'value' )

const bindS = attrName => evtName => lens => atom => (
  { [ evtName ]: setToAttr( attrName )( lens )( atom )
  , [ attrName ]: X.view( lens )( atom )
  }
)

const bindSOn = attrName => evtName => atom => lens =>
  bindS( attrName )
       ( evtName )
       ( R__.when( isUndefined )
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
  , rowType: R__.always( 'e.g. users, people' )
  , ui: {}
  }
const initDataContainer = R__.compose( freeze )( R.applySpec )( dataContainerSpec )
const putDataInContainer = R__.compose( R__.map( initDataContainer ) )( L.get( [ 'data' ] ) )
const freezeDataContainer = R__.compose( freeze )( putDataInContainer )

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
  .then( R__.compose( $, initDataContainer ) )

// TODO: Make it possible to send in a preprocessor / reducer (for instance, for validation)
const saveRowToApi = apiUrl => $ => dataL =>
  m.request( { method: "PUT"
             , url: apiUrl
             , data: view( dataL )( $ )
             , withCredentials: true
             }
           )
  .then( setOn$( $ )( dataL ) )
const saveRowToApi_ = apiUrl => dataL => $ =>
  saveRowToApi( apiUrl )( $ )( dataL )

const X =
  { apiUrlRoot
  , log
  , composeLog
  , logCall
  , list
  , mapObj
  , appendTo
  , notEquals
  , isUndefined
  , isNotUndefined
  , isFunction
  , isNotFunction
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
  , saveRowToApi_
  , getAttrs
  , view // tested
  , viewOn // tested
  , over // tested
  , over$
  , overOn // tested
  , overOn$
  , set // tested
  , set$
  , setOn // tested
  , setOn$
  , setToAttr
  , setToValueAttr
  , bindS
  , bindSOn
  , emptyStream // tested
  , makeStateContainer // tested
  , lensedAtom // partially tested
  , sortAscByProp
  }

module.exports = X
