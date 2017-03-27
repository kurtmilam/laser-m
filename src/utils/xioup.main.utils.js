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

const isUndefined = R.compose( R.equals( 'Undefined' ), R.type )
const isNotUndefined = R.complement( isUndefined )

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

// Following is a copy of m.withAttr that returns so it can be composed
// This is currently unused
// See here for the original: https://github.com/lhorie/mithril.js/blob/next/util/withAttr.js
// See here for why m.withAttr was rewritten so it wouldn't return:
// https://github.com/lhorie/mithril.js/issues/1551#issuecomment-273697482
// maybe always return true or add functionality that returns true or false based on validation logic
const withAttr =
  R.curry( ( attrName, callback, e ) =>
             callback( attrName in e.currentTarget
                         ? e.currentTarget[ attrName ]
                         : e.currentTarget.getAttribute( attrName )
                     )
         )

const withValueAttr = withAttr( 'value' )

// lensedStream operations
const getStreamProp =
  R.curry( ( stream, path ) =>
             L.get( path, stream() )
         )

// unused
const _updateStreamProp =
  R.curry( ( stream, lens ) =>
             R.compose( R.tap( stream )
                      , R.flip( lens )( stream() )
                      )
         )

const setStreamProp =
  R.curry( ( stream, path ) =>
             R.compose( R.tap( stream )
                      , R.flip( L.set( path ) )( stream() )
                      )
  )

const emptyStream = stream => () =>
  R.compose( R.tap( stream ), R.empty )( stream() )

// node functions
const _getEventAttr =
  R.curry( ( attrName, e ) =>
             attrName in e.currentTarget
               ? e.currentTarget[ attrName ]
               : e.currentTarget.getAttribute( attrName )
         )

const setStreamPropToEventAttr =
  R.curry( ( attrName, stream, path ) =>
             R.compose( setStreamProp( stream
                                     , path
                                     )
                      , _getEventAttr( attrName )
                      )
         )

const setStreamPropToEventValueAttr = setStreamPropToEventAttr( 'value' )

// make lensedStream
const _streamsPath = R.compose( R.pair( 'streams' ), joinOnDot )
const _getSliceStream = stream =>
  R.compose( getStreamProp( stream ), _streamsPath )
const _isSliceStream = stream => path =>
  R.compose( flyd.isStream, _getSliceStream( stream ) )( path )

const _dataPath = path => R.prepend( 'data')( path )
const _setData = stream =>
  R.compose( setStreamProp( stream ), _dataPath )
const _makeUpdaterStream = stream => path =>
  R.tap( flyd.on( R.when( isNotUndefined
                        , _setData( stream )( path )
                        )
                )
       )

const _registerSliceStream = stream =>
  R.compose( setStreamProp( stream ), _streamsPath )

const _addToMainStream = stream => path =>
  R.compose( R.tap( _registerSliceStream( stream )( path ) )
           , flyd.stream
           , R.tap( _setData( stream )( path ) )
           )

const _makeSliceStream = stream => path => init =>
  R.compose( _makeUpdaterStream( stream )( path )
           , _addToMainStream( stream )( path )
           )( init )

function lensedStream( stream ) {
  return ( path, init ) =>
    _isSliceStream( stream )( path )
      ? _getSliceStream( stream )( path )
      : _makeSliceStream( stream )( path )( init )
}

module.exports =
  { apiUrlRoot
  , joinOnSpace
  , log
  , showItemHref // tested
  , editItemHref // tested
  , m2
  , m3
  , loadItemListFromApi
  , loadItemFromApi
  , saveItemToApi
  , getAttrs
  , getStreamProp
  , setStreamProp
  , setStreamPropToEventAttr
  , setStreamPropToEventValueAttr
  , emptyStream
  , lensedStream
  }
