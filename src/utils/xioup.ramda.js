/**
 * Created by Kurt on 2017-04-10.
 */
// src/utils/xioup.ramda.js

//import libraries
import * as L from 'partial.lenses'

const always = a => _ => a
const compose = f => g => ( ...h ) => f( g( ...h ) )
// not working
// const converge = f => gs => ( ...h ) => compose( apply( f ) )
//                                        ( map( gs, unapply( identity )( ...h ) ) )
const identity = a => a
const flip = fn => a => ( b, ...c) => fn( b )( a, ...c )
const tap = fn => a => {
  fn( a )
  return a
}
const map = L.modify( L.elems )
const not = a => !a
// is is copied from https://github.com/ramda/ramda/blob/v0.23.0/src/is.js
const is = Constructor => a =>
  a != null && a.constructor === Constructor || a instanceof Constructor

const ifElse = f => g => h => ( ...a ) =>
  f( ...a ) ? g( ...a ) : h( ...a )
const when = f => g => ( ...a ) =>
  ifElse( f )( g )( identity )( ...a )


const join = a => b =>
  Array.prototype.join.call( b, a )

const toLower = a =>
  String.prototype.toLowerCase.call( a )

const toUpper = a =>
  String.prototype.toUpperCase.call( a )

const trim = a =>
  String.prototype.trim.call( a )

import complement from 'ramda/src/complement.js'
// const complement = f => R__.compose( not )( f ) // not working - have to lift it
import equals from 'ramda/src/equals.js'
import apply from 'ramda/src/apply.js'
import unapply from 'ramda/src/unapply.js'
import append from 'ramda/src/append.js'
import prepend from 'ramda/src/prepend.js'
import sort from 'ramda/src/sort.js'
import ascend from 'ramda/src/ascend.js'
import call from 'ramda/src/call.js'
import reduce from 'ramda/src/reduce.js'
import reduced from 'ramda/src/reduced.js'
import applySpec from 'ramda/src/applySpec.js'
import pair from 'ramda/src/pair.js'
import empty from 'ramda/src/empty.js'
import converge from 'ramda/src/converge.js'
import composeP from 'ramda/src/composeP.js'
import pipe from 'ramda/src/pipe.js'
import whereEq from 'ramda/src/whereEq.js'
import unnest from 'ramda/src/unnest.js'
import curry from 'ramda/src/curry.js'
import eqProps from 'ramda/src/eqProps.js'
import reject from 'ramda/src/reject.js'


import compose_R from 'ramda/src/compose.js'
import ifElse_R from 'ramda/src/ifElse.js'

// sort, ascend, call, reduce, reduced

const R =
  { always
  , compose
  , complement
  , identity
  , flip
  , tap
  , map
  , equals
  , not
  , is
  , ifElse
  , ifElse_R
  , when
  , join
  , toLower
  , toUpper
  , trim
  , unapply
  , apply
  , append
  , prepend
  , sort
  , ascend
  , call
  , reduce
  , reduced
  , applySpec
  , pair
  , empty
  , converge
  , composeP
  , pipe
  , whereEq
  , unnest
  , curry
  , eqProps
  , reject
  , compose_R
  }

module.exports = R
