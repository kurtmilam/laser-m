/**
 * Created by Kurt on 2017-03-10.
 */
// src/utils/xioup.main.utils.js

// import libraries
import m from 'mithril'
import R from 'ramda'
import * as L from 'partial.lenses'

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

const updateStreamProp =
  R.curry( ( lens, stream ) =>
             R.compose( stream,  R.flip( lens )( stream() ) )
         )

const setStreamPropToAttr =
  R.curry( ( attr, stream, path ) =>
             R.compose( updateStreamProp( L.set( pathToOptic( path ) ), stream ), getAttr( attr ) )
         )

const setStreamPropToValueAttr = setStreamPropToAttr( 'value' )

const getStreamProp =
  R.curry( ( stream, path ) =>
             L.get( pathToOptic( path ), stream() )
         )

// local state
const lensedStreamOld = function ( path, stream, init ) {
  const optic = pathToOptic( path )
  if ( typeof getStreamProp( stream, path ) === 'undefined' ) {
    updateStreamProp( L.set( optic ), stream )( init )
  }
    return function ( value ) {
      if ( arguments.length === 0 )
        return getStreamProp( stream, path )
      else
        return L.get( optic, updateStreamProp( L.set( optic ), stream )( value ) )
    }
}

const lensedStream = function ( path, stream, init ) {
  const optic = pathToOptic( path )
  if ( typeof getStreamProp( stream, path ) === 'undefined' ) {
    updateStreamProp( L.set( optic ), stream )( init )
  }
  return function ( value ) {
    if ( arguments.length === 0 ) {
      return getStreamProp( stream, path )
    } else {
      // for mithril.stream
      // return L.get( optic, updateStreamProp( L.set( optic ), stream )( value ) )
      // for flyd
      return L.get( optic, updateStreamProp( L.set( optic ), stream )( value ) )
    }

    return L.get( optic, updateStreamProp( L.set( optic ), stream )( value ) )
  }
}

const emptyStream = stream => () =>
  R.compose( stream, R.empty )( stream() )

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
  , pathToOptic
  , updateStreamProp
  , setStreamPropToAttr
  , setStreamPropToValueAttr
  , getStreamProp
  , lensedStream
  , emptyStream
  }
