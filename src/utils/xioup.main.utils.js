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

const list = R.unapply( R.identity )
const map = L.modify( L.elems )
const K = a => _ => a

const appendTo = R.flip( R.append )

const isUndefined = R.compose( R.equals( 'Undefined' ), R.type )
const isNotUndefined = R.complement( isUndefined )
const isFunction = R.compose( R.equals( 'Function' ), R.type )
const isNotFunction = R.complement( isFunction )

const joinOnSpace = R.join( ' ' )
const joinOnDot = R.join( '.' )

// anchor href functions
const showRowHref = R.curry( ( a, b ) => `/${ R.toLower( a ) }/${ b.id }` )
const editRowHref = R.curry( ( a, b ) => `/${ R.toLower( a ) }/${ b.id }/edit` )

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
const select = stream => optic => {
  // console.log( 'stream', stream(), 'optic', optic )
  // return Object.freeze( L.get( optic, stream() ) )
  return L.get( optic, stream() )
}

const funcOrAlways = R.when( isNotFunction, K )
// For instance:
// const list = state(['models','users','list'], {})
// const modifyList = X.update( list, [] )
// modifyList( R.map( R.over( R.lensProp( 'firstName' ), R.toLower) ) )
// modifyList( R.over( R.lensPath( [ 0, 'firstName' ] ), R.toUpper ) )

// This should be faster than calling 'update' with a non-function value
const over = stream => optic => fn =>
  R.compose( R.tap( stream )
           , Object.freeze
           , L.modify( optic, fn )
          )( stream() )

// This should be faster than calling 'update' with a non-function value
const set = stream => optic => value =>
  R.compose( R.tap( stream )
           , Object.freeze
           , L.modify( optic, K( value ) )
          )( stream() )

// convenience function that can be called with a function or value
const update = stream => optic => value =>
  isFunction( value )
  ? over( stream )( optic )( value )
  : set( stream )( optic )( value )

const emptyStream = stream =>
  over( stream )( [] )( R.empty )

// make lensedStream
function lensedStream( stream ) {
  return function ( optic, init ) {
    const streamsOptic = R.compose( R.pair( 'streams' ), joinOnDot )
    const selectSliceStream =
      R.compose( select( stream ), streamsOptic )
    const isSliceStream =
      R.compose( flyd.isStream, selectSliceStream )

    const dataOptic = R.prepend( 'data')
    const setData =
      R.compose( set( stream ), dataOptic )
    const makeUpdaterStream =
      R.tap( flyd.on( R.when( isNotUndefined
                            , setData( optic )
                           )
                   )
          )

    const registerSliceStream =
      R.compose( set( stream ), streamsOptic )

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
        ? selectSliceStream( optic )
        : makeSliceStream( init )

    return sliceStream

  }
}

const lensedAtom = function ( optic, stream, init ) {
  if ( typeof select( stream )( optic ) === 'undefined' )
    set( stream )( optic )( init )
    return value =>
             isUndefined( value )
             ? select( stream )( optic )
             : Object.freeze( L.get( optic, set( stream )( optic )( value ) ) )
             // return L.get( optic, set( stream )( optic )( value ) )
}
// not sure why the following aren't working (for instance, in UserEdit)
// const _lensedAtom = R.curry( _lensedAtom )
// const _lensedAtom = optic => stream => init => _lensedAtom( optic, stream, init )

// node functions
const _getEventAttr =
  R.curry( ( attrName, e ) =>
             attrName in e.currentTarget
               ? e.currentTarget[ attrName ]
               : e.currentTarget.getAttribute( attrName )
        )

const setToAttr =
  R.curry( ( attrName, stream, optic ) =>
             R.compose( set( stream )( optic )
                      , _getEventAttr( attrName )
                     )
        )

const setToValueAttr = setToAttr( 'value' )

// api model functions
const modelContainerSpec =
  { id: L.get( 'id' )
  , children: []
  , computed: {}
  , data: Object.freeze
  , rowType: K( 'e.g. users, people' )
  , ui: {}
  }
const modelContainer = R.compose( Object.freeze, R.applySpec( modelContainerSpec ) )

// TODO: Make it possible to send in a preprocessor / reducer (for instance, for sorting)
const loadTableFromApi =
  //R.curry( ( apiUrl, stream, reducer ) => () =>
  apiUrl => _ =>
    m.request( { method: "GET"
               , url: apiUrl
               , withCredentials: true
               }
            )
    // .then( R.compose( stream, reducer, L.get( 'data' ) ) )
    .then( R.compose( Object.freeze, map( modelContainer ), L.get( 'data' ) ) )
    // .then( R.compose( sortByProp( 'firstName' ), L.get( 'data' ) ) )


// TODO: Make it possible to send in a preprocessor / reducer (for instance, for normalization)
const loadRowFromApi =
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
const saveRowToApi =
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
  , list
  , map
  , K
  , appendTo
  , isUndefined
  , isNotUndefined
  , isFunction
  , isNotFunction
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
  , select // tested
  , over
  , set // tested
  , update
  , setToAttr
  , setToValueAttr
  , emptyStream // tested
  , lensedStream // tested
  , lensedAtom
  , sortByProp
  }

window.X = X
window.R = R
window.L = L
window.flyd = flyd
module.exports = X

