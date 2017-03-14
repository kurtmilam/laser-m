/**
 * Created by Kurt on 2017-03-10.
 */
// src/utils/xioup.main.utils.js

// import libraries
import m from 'mithril'
import * as L from 'partial.lenses'
import append from 'ramda/src/append'
import compose from 'ramda/src/compose'
import concat from 'ramda/src/concat'
import R from 'ramda'

// config
const apiUrlRoot = 'http://rem-rest-api.herokuapp.com/api'

// generic
const spacer = R.join( ' ' )
const log = R.tap( console.log )

// route and link functions
const showItemHref = a => b => `/${ R.toLower( a ) }/${ b.id }`
const editItemHref = a => b => `/${ R.toLower( a ) }/${ b.id }/edit/`

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
  , getAttrs
  , withValueAttr
  , showItemHref
  , editItemHref
  , getAttr
  , updateStreamProp
  , setStreamPropToAttr
  , getStreamProp
  }
