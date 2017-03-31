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

const modifyStreamProp =
  R.curry( ( stream, optic, fn ) =>
             R.compose( R.tap( stream )
                      // , R.tap( m.redraw )
                      , L.modify( optic, fn )
                      )( stream() )
  )

// For instance:
// const list = state(['models','users','list'], {})
// const modifyList = X.modifyStreamProp( list, [] )
// modifyList( R.map( R.over( R.lensProp( 'firstName' ), R.toLower) ) )
// modifyList( R.over( R.lensPath( [ 0, 'firstName' ] ), R.toUpper ) )

const setStreamProp =
  R.curry( ( stream, optic, value ) =>
             X.modifyStreamProp( stream, optic, R.always( value ) )
  )

const emptyStream = stream => () =>
  modifyStreamProp( stream, [], R.empty )

// make lensedStream
function lensedStream( stream ) {
  return function ( optic, init ) {
    const streamsOptic = R.compose( R.pair( 'streams' ), joinOnDot )
    const getSliceStream =
      R.compose( getStreamProp( stream ), streamsOptic )
    const isSliceStream =
      R.compose( flyd.isStream, getSliceStream )

    const dataOptic = R.prepend( 'data')
    const setData =
      R.compose( setStreamProp( stream ), dataOptic )
    const makeUpdaterStream =
      R.tap( flyd.on( R.when( isNotUndefined
                            , setData( optic )
                            )
                    )
           )

    const registerSliceStream =
      R.compose( setStreamProp( stream ), streamsOptic )

    const addToMainStream =
      R.compose( R.tap( registerSliceStream( optic ) )
               , flyd.stream
               , R.tap( R.compose( setData( optic ) ) )
               )

    const makeSliceStream =
      R.compose( makeUpdaterStream
               , addToMainStream
               )

    const sliceStream
      = isSliceStream( optic )
        ? getSliceStream( optic )
        : makeSliceStream( init )

    return sliceStream

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

const X =
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
  , modifyStreamProp
  , setStreamProp // tested
  , setStreamPropToAttr
  , setStreamPropToValueAttr
  , emptyStream // tested
  , lensedStream // tested
  }

window.X = X
window.R = R
window.L = L
window.flyd = flyd
module.exports = X

