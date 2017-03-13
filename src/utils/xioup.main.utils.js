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
import curry from 'ramda/src/curry'
import toLower from 'ramda/src/toLower'
import join from 'ramda/src/join'
import tap from 'ramda/src/tap'

// config
const apiUrlRoot = 'http://rem-rest-api.herokuapp.com/api'

// generic
const spacer = join( ' ' )
const log = tap( console.log )

// route and link functions
const _getRouteLink = L.get( [ 'route', 'link' ] )
const routeLink = _getRouteLink( m )
const showItemHref = a => b => `/${ toLower( a ) }/${ getId( b ) }`
const editItemHref = a => b => `/${ toLower( a ) }/${ getId( b ) }/edit/`

// vnode functions
const getChildren = L.get( 'children' )
const getAttrs = L.get( 'attrs' )
// Following is a copy of withAttr that returns so it can be composed
// See here for the original: https://github.com/lhorie/mithril.js/blob/next/util/withAttr.js
const withAttr = curry( ( attrName, callback ) => e =>
  callback( attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute( attrName ) )
)
const withValueAttr = withAttr( 'value' )

// data functions
const getData = L.get( 'data' )
const getId = L.get( 'id' )

const getList = L.get( 'list' )
const getloadItemList = L.get( 'loadItemList' )

module.exports =
  { apiUrlRoot
  , spacer
  , log
  , routeLink
  , getChildren
  , getAttrs
  , withValueAttr
  , getData
  , getId
  , showItemHref
  , editItemHref
  , getList
  , getloadItemList
  }
