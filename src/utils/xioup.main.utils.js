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
const showItemHref = a => b => `/${ R.toLower( a ) }/${ b.id }`
const editItemHref = a => b => `/${ R.toLower( a ) }/${ b.id }/edit/`

// component functions
const m1 = R.curryN( 1, m )
const m2 = R.curryN( 2, m )
const m3 = R.curryN( 3, m )

// vnode functions
const getAttrs = L.get( 'attrs' )
// Following is a copy of withAttr that returns so it can be composed
// See here for the original: https://github.com/lhorie/mithril.js/blob/next/util/withAttr.js
const withAttr =
  R.curry( ( attrName, callback, e ) =>
             callback( attrName in e.currentTarget
                         ? e.currentTarget[attrName]
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
const updateStreamProp =
  R.curry( ( lens, stream ) =>
             R.compose( stream,  R.flip( lens )( stream() ) )
         )
const setStreamPropToAttr =
  R.curry( ( prop, stream, attr ) =>
             R.compose( updateStreamProp( L.set( prop ), stream ), getAttr( attr ) )
         )
const getStreamProp =
  R.curry( ( prop, stream ) =>
             L.get( prop, stream() )
         )

module.exports =
  { apiUrlRoot
  , spacer
  , log
  , showItemHref
  , editItemHref
  , m1
  , m2
  , m3
  , getAttrs
  , withValueAttr
  , getAttr
  , updateStreamProp
  , setStreamPropToAttr
  , getStreamProp
  }
