/**
 * Created by Kurt on 2017-03-10.
 */
// src/utils/xioup.main.utils.js

// import libraries
import m from 'mithril'
import R from 'ramda'
import * as L from 'partial.lenses'
import flyd from 'flyd'
// import uuidV4 from 'uuid/v4'

// config
const apiUrlRoot = 'http://rem-rest-api.herokuapp.com/api'

// generic
const spacer = R.join( ' ' )
const log = R.tap( console.log )

// route and link functions
const showItemHref = R.curry( ( a, b ) => `/${ R.toLower( a ) }/${ b.id }` )
const editItemHref = R.curry( ( a, b ) => `/${ R.toLower( a ) }/${ b.id }/edit/` )

// component functions
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

// node functions
const getAttr =
  R.curry( ( attrName, e ) =>
             attrName in e.currentTarget
               ? e.currentTarget[ attrName ]
               : e.currentTarget.getAttribute( attrName )
         )

// stream functions
const pathToOptic = R.split( '.' )

// Created for flyd. Useful in compositions.
// Set the stream, then call this to return the new stream's value by executing stream()
// Also works with any other function
const alwaysCallFn = stream => R.compose( R.call, R.always( stream ) )

const updateStreamProp =
  R.curry( ( stream, lens ) =>
             // for flyd:
             R.compose( alwaysCallFn( stream ), stream, R.flip( lens )( stream() ) )
             // for mithril.stream:
             // R.compose( stream,  R.flip( lens )( stream() ) )
         )

const setStreamPropToAttr =
  R.curry( ( attr, stream, optic ) =>
             R.compose( updateStreamProp( stream
                                        , L.set( optic )
                                        )
                      , getAttr( attr )
                      )
         )

const setStreamPropToValueAttr = setStreamPropToAttr( 'value' )

const getStreamProp =
  R.curry( ( stream, optic ) =>
             L.get( optic, stream() )
         )

const emptyStream = stream => () =>
  R.compose( stream, R.empty )( stream() )

function lensedStream ( stream ) {
  return function ( optic, init ) {
    const payloadOptic = R.prepend( 'payload', optic )
    // const streamsKey = uuidV4()
    const streamsOptic = R.pair( 'streams', R.join( '.', optic ) )

    const currLens = getStreamProp( stream, streamsOptic )
    if ( flyd.isStream( currLens ) ) {
      return currLens
    } else {
      updateStreamProp( stream, L.set( payloadOptic ) )( init )
      updateStreamProp( stream, L.set( streamsOptic ) )( flyd.stream( init ) )
      // const lensStream = optic.length > 1
      //   ? R.last( R.map( lensedStream( stream ), optic ) )
      //   : getStreamProp( stream, streamsOptic )
      const lensStream = getStreamProp( stream, streamsOptic )
      const oStream = flyd.on( function ( value ) {
        if ( 'Undefined' !== R.type( value ) ) {
          updateStreamProp( stream, L.set( payloadOptic ) )( value )
        }
      }, lensStream )
      return lensStream
    }
  }
}

module.exports =
  { apiUrlRoot
  , spacer
  , log
  , showItemHref
  , editItemHref
  , m2
  , m3
  , loadItemListFromApi
  , loadItemFromApi
  , saveItemToApi
  , getAttrs
  , withValueAttr
  , getAttr
  , alwaysCallFn
  , pathToOptic
  , updateStreamProp
  , setStreamPropToAttr
  , setStreamPropToValueAttr
  , getStreamProp
  , emptyStream
  , lensedStream
  }
