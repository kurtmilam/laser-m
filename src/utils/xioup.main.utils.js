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


const sortByProp =
  R.compose( R.sort
           , R.ascend
           , L.get
           )

// vnode functions
const getAttrs = L.get( 'attrs' )

// lensedStream operations
const getStreamProp = stream => optic =>
  L.get( optic, stream() )

const modifyStreamProp = stream => optic => fn =>
  R.compose( R.tap( stream )
           // , R.tap( m.redraw )
           , L.modify( optic, fn )
           )( stream() )
// For instance:
// const list = state(['models','users','list'], {})
// const modifyList = X.modifyStreamProp( list, [] )
// modifyList( R.map( R.over( R.lensProp( 'firstName' ), R.toLower) ) )
// modifyList( R.over( R.lensPath( [ 0, 'firstName' ] ), R.toUpper ) )

const setStreamProp = stream => optic => value =>
  X.modifyStreamProp( stream )( optic )( R.always( value ) )

const emptyStream = stream =>
  modifyStreamProp( stream )( [] )( R.empty )

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

const lensedStreamAlt = function ( path, stream, init ) {
  const pathToOptic = R.split( '.' )
  const optic = pathToOptic( path ) // = R.split( '.', optic )
  if ( typeof getStreamProp( stream )( optic ) === 'undefined' )
    setStreamProp( stream )( optic )( init )
    return function ( value ) {
      if ( arguments.length === 0 )
        return getStreamProp( stream )( optic )
      else
        return L.get( optic, setStreamProp( stream )( optic )( value ) )
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
             R.compose( setStreamProp( stream )( optic )
                      , _getEventAttr( attrName )
                      )
         )

const setStreamPropToValueAttr = setStreamPropToAttr( 'value' )

// api model functions
const modelContainerSpec =
  { id: R.compose( L.get( 'id' ) )
  , model: R.identity
  , ui: {}
  , comp: {}
  }
const modelContainer = R.applySpec( modelContainerSpec )

// TODO: Make it possible to send in a preprocessor / reducer (for instance, for sorting)
const loadItemListFromApi =
  //R.curry( ( apiUrl, stream, reducer ) => () =>
  apiUrl => _ =>
    m.request( { method: "GET"
               , url: apiUrl
               , withCredentials: true
               }
             )
    // .then( R.compose( stream, reducer, L.get( 'data' ) ) )
    .then( R.compose( R.map( modelContainer ), L.get( 'data' ) ) )
    // .then( R.compose( sortByProp( 'firstName' ), L.get( 'data' ) ) )


// TODO: Make it possible to send in a preprocessor / reducer (for instance, for normalization)
const loadItemFromApi =
  R.curry( ( apiUrl, stream ) => id =>
             m.request( { method: "GET"
                        , url: apiUrl
                        , data: { id }
                        , withCredentials: true
                        }
                      )
             .then( R.compose( stream, modelContainer ) )
         )

// TODO: Make it possible to send in a preprocessor / reducer (for instance, for validation)
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

const X =
  { apiUrlRoot
  , log
  , logCall
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
  , lensedStreamAlt
  , sortByProp
  }

window.X = X
window.R = R
window.L = L
window.flyd = flyd
module.exports = X

