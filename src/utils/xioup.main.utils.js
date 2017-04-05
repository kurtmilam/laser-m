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
const log = R.tap( console.log )
const logCall = R.tap( compose( log, R.call ) )

const list = R.unapply( R.identity )
const map = L.modify( L.elems )
const mapObj = L.modify( L.values )
const K = a => _ => a

const appendTo = R.flip( R.append )

const isUndefined = compose( R.equals( 'Undefined' ) )( R.type )
const isNotUndefined = R.complement( isUndefined )
const isFunction = compose( R.equals( 'Function' ) )( R.type )
const isNotFunction = R.complement( isFunction )

const joinOnSpace = R.join( ' ' )
const joinOnDot = R.join( '.' )

// anchor href functions
const showRowHref = a => b => `/${ R.toLower( a ) }/${ b.id }`
const editRowHref = a => b => `/${ R.toLower( a ) }/${ b.id }/edit`

// mithril component functions
const m2 = R.curryN( 2, m )
const m3 = R.curryN( 3, m )

const srtAsc = compose( R.sort )( R.ascend )
const sortByProp = compose( srtAsc )( L.get )

// vnode functions
const getAttrs = L.get( 'attrs' )

// stateContainer operations
const get = src$ => optic => L.get( optic, src$() )

const view = optic => src$ => L.get( optic, src$() )

// For instance:
// const list = state(['models','users','list'], {})
// const modifyList = X.update( list, [] )
// modifyList( R.map( R.over( R.lensProp( 'firstName' ), R.toLower) ) )
// modifyList( R.over( R.lensPath( [ 0, 'firstName' ] ), R.toUpper ) )

const over = src$ => optic => fn =>
  R.compose( R.tap( src$ )
           , Object.freeze
           , L.modify( optic, fn )
           )( src$() )

const set = src$ => optic => value =>
  R.compose( R.tap( src$ )
           , Object.freeze
           , L.set( optic, value )
           )( src$() )

const setNew = optic => value => src$ =>
  R.compose( R.tap( src$ )
           , Object.freeze
           , L.set( optic, value )
           , R.call
           )

// convenience function that can be called with a function or value
const update = src$ => optic => value =>
  isFunction( value )
    ? over( src$ )( optic )( value )
    : set( src$ )( optic )( value )

const emptyStream = src$ => optic =>
  over( src$ )( optic )( R.empty )

// make stateContainer
function stateContainer( src$ ) {
  return function ( optic, init ) {
    const streamsO = compose( R.pair( 'streams' ) )( joinOnDot )
    const getLensed$ = compose( view )( streamsO )( optic )
    const isLensed$ = compose( flyd.isStream )( getLensed$ )

    const dataO = R.prepend( 'data' )
    const setData =
      compose( set( src$ ) )( dataO )
      // setNew( dataO( optic ) )( init )
    const makeUpdater$ =
      R.tap( flyd.on( R.when( isNotUndefined
                            , setData( optic )
                            )
                    )
           )

    const registerLensed$ =
      compose( set( src$ ) )( streamsO )

    const addToMain$ =
      R.compose( R.tap( registerLensed$( optic ) )
               , flyd.stream
               , R.tap( setData( optic ) )
               )

    const makeLensed$ =
      compose( makeUpdater$ )( addToMain$ )

    const lensed$ =
            isLensed$( src$ )
              ? getLensed$( src$ )
              : makeLensed$( init )

    return lensed$
  }
}

const lensedAtom = function ( optic, src$, init ) {
  const atom = _ => view( optic )( src$ )
  if ( typeof atom() === 'undefined' )
    set( src$ )( optic )( init )
    return value =>
             isUndefined( value )
             ? atom()
             : Object.freeze( L.get( optic, set( src$ )( optic )( value ) ) )
             // return L.get( optic, set( src$ )( optic )( value ) )
}
// not sure why the following aren't working (for instance, in UserEdit)
// const _lensedAtom = R.curry( _lensedAtom )
// const _lensedAtom = optic => src$ => init => _lensedAtom( optic, src$, init )

// node functions
const _getEventAttr = attrName => e =>
  attrName in e.currentTarget
    ? e.currentTarget[ attrName ]
    : e.currentTarget.getAttribute( attrName )

const setToAttr = attrName => src$ => optic =>
  R.compose( set( src$ )( optic )
           , _getEventAttr( attrName )
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
const loadTableFromApi = apiUrl => _ =>
  m.request( { method: "GET"
             , url: apiUrl
             , withCredentials: true
             }
          )
  .then( R.compose( Object.freeze, map( modelContainer ), L.get( [ 'data' ] ) ) )


// TODO: Make it possible to send in a preprocessor / reducer (for instance, for normalization)
const loadRowFromApi = apiUrl => src$ => id =>
  m.request( { method: "GET"
             , url: apiUrl
             , data: { id }
             , withCredentials: true
             }
           )
  .then( R.compose( src$, modelContainer ) )

// TODO: Make it possible to send in a preprocessor / reducer (for instance, for validation)
const saveRowToApi = apiUrl => src$ => data =>
  m.request( { method: "PUT"
             , url: apiUrl
             , data: data
             , withCredentials: true
             }
           )
  .then( set( src$, [ 'data' ] ) )

const X =
  { apiUrlRoot
  , compose
  , log
  , logCall
  , list
  , map
  , mapObj
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
  , get // tested
  , view
  , over // tested
  , set // tested
  , update // tested
  , setToAttr
  , setToValueAttr
  , emptyStream // tested
  , stateContainer // tested
  , lensedAtom // partially tested
  , sortByProp
  }

window.X = X
window.R = R
window.L = L
window.flyd = flyd
module.exports = X

