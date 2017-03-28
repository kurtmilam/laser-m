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
const log = R.tap( console.log )
const logCall = R.tap( R.compose( log, R.call ) )

const isUndefined = R.compose( R.equals( 'Undefined' ), R.type )
const isNotUndefined = R.complement( isUndefined )
const isFunction = R.compose( R.equals( 'Function' ), R.type )
const isNotFunction = R.complement( isFunction )

const joinOnSpace = R.join( ' ' )
const joinOnDot = R.join( '.' )

// anchor href functions
const showItemHref = R.curry( ( a, b ) => `/${ R.toLower( a ) }/${ b.id }` )
const editItemHref = R.curry( ( a, b ) => `/${ R.toLower( a ) }/${ b.id }/edit` )

// mithril component functions
const m2 = R.curryN( 2, m )
const m3 = R.curryN( 3, m )

// api model functions
const loadItemListFromApi =
  R.curry( ( apiUrl, stream ) => () =>
             m.request( { method: "GET"
                        , url: apiUrl
                        , withCredentials: true
                        }
                      )
             .then( R.compose( stream, L.get( 'data' ) ) )
         )

const loadItemFromApi =
  R.curry( ( apiUrl, stream ) => id =>
             m.request( { method: "GET"
                        , url: apiUrl
                        , data: { id }
                        , withCredentials: true
                        }
                      )
             .then( stream )
         )

const saveItemToApi =
  R.curry( ( apiUrl, stream ) => data =>
             m.request( { method: "PUT"
                         , url: apiUrl
                         , data: data
                         , withCredentials: true
                         }
                      )
             .then( stream )
         )

// vnode functions
const getAttrs = L.get( 'attrs' )

// lensedStream operations
const getStreamProp =
  R.curry( ( stream, optic ) =>
             L.get( optic, stream() )
         )

const setStreamProp =
  R.curry( ( stream, optic ) =>
             R.compose( R.tap( stream )
                      , R.flip( L.set( optic ) )( stream() )
                      )
  )

const emptyStream = stream => () =>
  R.compose( R.tap( stream ), R.empty )( stream() )

// make lensedStream
const _streamsOptic = R.compose( R.pair( 'streams' ), joinOnDot )
const _getSliceStream = stream =>
  // R.compose( log, getStreamProp( stream ), log, _streamsOptic, log )
  R.compose( getStreamProp( stream ), _streamsOptic )
const _isSliceStream = stream => optic =>
  R.compose( flyd.isStream, _getSliceStream( stream ) )( optic )

const _dataOptic = optic => R.prepend( 'data')( optic )
const _setData = stream =>
  R.compose( setStreamProp( stream ), _dataOptic )
const _makeUpdaterStream = stream => optic =>
  R.tap( flyd.on( R.when( isNotUndefined
                        , _setData( stream )( optic )
                        )
                )
       )

const _registerSliceStream = stream =>
  //R.compose( log, setStreamProp( stream ), log, _streamsOptic, log )
  R.compose( setStreamProp( stream ), _streamsOptic )

const _addToMainStream = stream => optic =>
  R.compose( log, R.tap( _registerSliceStream( stream )( optic ) )
           //, logCall
           //, log
           , flyd.stream
           // , R.tap( _setData( stream )( optic ) )
           , R.tap( R.compose( log, _setData( stream )( optic ) ) )
           )

const _makeSliceStream = stream => optic => init =>
  R.compose( _makeUpdaterStream( stream )( optic )
           , _addToMainStream( stream )( optic )
           )( init )
const tmpStream = flyd.stream({})
const test = _addToMainStream(tmpStream)(['a', 'b'])({})
console.log('test', test)
console.log('tmpStream()', tmpStream())
console.log('tmpStream().streams["a.b"]()', tmpStream().streams["a.b"]())

function lensedStream( stream ) {
  return ( optic, init ) =>
    _isSliceStream( stream )( optic )
      ? _getSliceStream( stream )( optic )
      : _makeSliceStream( stream )( optic )( init )
}

// node functions
const _getEventAttr =
  R.curry( ( attrName, e ) =>
             attrName in e.currentTarget
               ? e.currentTarget[ attrName ]
               : e.currentTarget.getAttribute( attrName )
         )

const setStreamPropToAttr =
  R.curry( ( attrName, stream, optic ) =>
             R.compose( setStreamProp( stream
                                     , optic
                                     )
                      , _getEventAttr( attrName )
                      )
         )

const setStreamPropToValueAttr = setStreamPropToAttr( 'value' )

module.exports =
  { apiUrlRoot
  , log
  , isUndefined
  , isNotUndefined
  , isFunction
  , isNotFunction
  , joinOnSpace
  , showItemHref // tested
  , editItemHref // tested
  , m2
  , m3
  , loadItemListFromApi
  , loadItemFromApi
  , saveItemToApi
  , getAttrs
  , getStreamProp // tested
  , setStreamProp // tested
  , setStreamPropToAttr
  , setStreamPropToValueAttr
  , emptyStream // tested
  , lensedStream
  }
