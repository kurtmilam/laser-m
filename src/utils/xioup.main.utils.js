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
  R.curry( ( stream, optic, newValue ) =>
             R.compose( R.tap( stream )
                      , R.flip( L.set( optic ) )( stream() )
                      )( newValue )
  )

const emptyStream = stream => () =>
  R.compose( R.tap( stream ), R.empty )( stream() )

// make lensedStream
function lensedStream( stream ) {
  return function ( optic, init ) {
    const _streamsOptic = R.compose( R.pair( 'streams' ), joinOnDot )
    const _getSliceStream =
      R.compose( getStreamProp( stream ), _streamsOptic )
    const _isSliceStream =
      R.compose( flyd.isStream, _getSliceStream )

    const _dataOptic = R.prepend( 'data')
    const _setData =
      R.compose( setStreamProp( stream ), _dataOptic )
    const _makeUpdaterStream =
      R.tap( flyd.on( R.compose( log, R.when( isNotUndefined
                                       , _setData( optic )
                                       )
                               , log
                               )
                    )
           )

    const _registerSliceStream =
      R.compose( setStreamProp( stream ), _streamsOptic )

    const _addToMainStream =
      R.compose( R.tap( _registerSliceStream( optic ) )
               , flyd.stream
               , R.tap( R.compose( _setData( optic ) ) )
               )

    const _makeSliceStream =
      R.compose( _makeUpdaterStream
               , _addToMainStream
               )

    return _isSliceStream( optic )
           ? _getSliceStream
           : _makeSliceStream( init )

  }
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
  , joinOnDot
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
