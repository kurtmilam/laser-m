/**
 * Created by Kurt on 2017-03-10.
 */
// src/utils/main.utils.js

// import libraries
import m from 'mithril'
import * as L from 'partial.lenses'
import append from 'ramda/src/append'
import compose from 'ramda/src/compose'
import concat from 'ramda/src/concat'
import curry from 'ramda/src/curry'
import flip from 'ramda/src/flip'
import join from 'ramda/src/join'
import tap from 'ramda/src/tap'

// generic
const spacer = join( ' ' )
const log = tap( console.log )

// route and link functions
const _routeLens = L.prop( 'route' )
const _linkLens = L.prop( 'link' )
const _routeLinkLens = L.compose( _routeLens, _linkLens )
const _getRouteLink = L.get( _routeLinkLens )
const routeLink = _getRouteLink( m )

// vnode functions
const _childrenLens = L.prop( 'children' )
const getChildren = L.get( _childrenLens )
// Following is a copy of withAttr that returns so it can be composed
// See here for the original: https://github.com/lhorie/mithril.js/blob/next/util/withAttr.js
const withAttr = curry( ( attrName, callback ) => e =>
  callback( attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute( attrName ) )
)
const withValue = withAttr( 'value' )

// data functions
const _idLens = L.prop( 'id' )
const getId = L.get( _idLens )
const _attrsLens = L.prop( 'attrs' )
const getAttrs = L.get( _attrsLens )

const _listLens = L.prop( 'list' )
const getList = L.get( _listLens )
const _loadListLens = L.prop( 'loadList' )
const getLoadList = L.get( _loadListLens )

// other
const editHref = compose( join( '' ), append( '/edit/' ), String, getId )


export default
  { spacer
  , log
  , routeLink
  , getChildren
  , withValue
  , getId
  , getAttrs
  , editHref
  , getList
  , getLoadList
  }
