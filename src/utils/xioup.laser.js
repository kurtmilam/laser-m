/**
 * Created by Kurt on 2017-04-10.
 */
// src/utils/xioup.laser.js

// import libraries
import * as R from './xioup.ramda'
import * as X from './xioup.main.utils'
import * as L from 'partial.lenses'
import flyd from 'flyd'

// makeStateContainer operations
const view = lens => $ => L.get( lens, $() )
const viewOn = $ => lens => view( lens )( $ )

const saveHistory = R.identity // logWithMsg( 'history' )

// TODO: Only update if the new value != the old value?
// dispatcher for L.modify and L.get
const _dispatch = action => updateStream => lens => a => $ =>
  R.compose( R.compose( updateStream )
                  ( X.freeze )
         )
         ( R.compose( L[ action ]( lens, a ) )
                  ( saveHistory )
         )
         ( $() )

const _setAndReturn$ = $ =>
  R.compose( R.always( $ ) )
         ( $ )

// over starts here
const _dispatchModify = _dispatch( 'modify' )

const over = lens => a => $ =>
  _dispatchModify( R.tap( $ ) )
                 ( lens )
                 ( a )
                 ( $ )
const overOn = $ => lens => a =>
  over( lens )
      ( a )
      ( $ )

const over$ = lens => a => $ =>
  _dispatchModify( _setAndReturn$( $ ) )
                 ( lens )
                 ( a )
                 ( $ )
const overOn$ = $ => lens => a =>
  over$( lens )
       ( a )
       ( $ )

// set starts here
const _dispatchSet = _dispatch( 'set' )

const set = lens => a => $ =>
  _dispatchSet( R.tap( $ ) )
              ( lens )
              ( a )
              ( $ )
const setOn = $ => lens => a =>
  set( lens )
     ( a )
     ( $ )

const set$ = lens => a => $ =>
  _dispatchSet( _setAndReturn$( $ ) )
              ( lens )
              ( a )
              ( $ )
const setOn$ = $ => lens => a =>
  set$( lens )
      ( a )
      ( $ )

const emptyStream = lens => over( lens )( R.empty )

const lensedAtom = function ( lens, $, init ) {
  const withAtom = X.applyUnaryTo( [ $, lens ] )
  // const stream$ = flyd.stream( init )
  if ( typeof withAtom( viewOn ) === 'undefined' )
    // The following change isn't really tested. The tested version is commented out
    withAtom( setOn$ )( init )
    // withAtom( setOn )( init )

  // I had a hard time trying to make the following point-free
  // Also having trouble making it work with my ifElse
  return a =>
    R.ifElse_R( X.isUndefined
            , _ => withAtom( viewOn )
            , withAtom( setOn$ )
            )( a )

}
// not sure why the following aren't working (for instance, in UserEdit)
// const _lensedAtom = R.curry( _lensedAtom )
// const _lensedAtom = lens => $ => init => _lensedAtom( lens, $, init )

function makeStateContainer( $ ) {
  return function ( lens, init ) {
    // return a lensedAtom on [ 'data' ] in the state stream if no arguments are supplied
    if( X.isUndefined( lens ) ) {
      return lensedAtom( [ 'data' ], $, {} )
      // return $
    }
    const streamsL = R.compose( R.pair( 'streams' ) )
                              ( X.joinOnDot )
    const getLensedStream$ = R.compose( view )
                                      ( streamsL )
                                      ( lens )

    const dataL = R.prepend( [ 'data' ] )
    const setData = R.compose( setOn( $ ) )
                             ( dataL )

    const makeUpdaterStream =
      R.tap( flyd.on( R.when( X.isNotUndefined )
                          ( setData( lens ) )
                    )
           )

    const registerLensedStream = R.compose( setOn( $ ) )( streamsL )

    const addToMain$ =
      R.compose( R.tap( registerLensedStream( lens ) ) )
               ( R.compose( flyd.stream )
                          ( R.tap( setData( lens ) ) )
               )

    const makeLensed$ = R.compose( makeUpdaterStream )
                                 ( addToMain$ )

    const lensedStream$ =
      R.compose( flyd.isStream )
               ( getLensedStream$ )( $ )
                 ? getLensedStream$( $ )
                 : makeLensed$( init )

    return lensedStream$
  }
}

// node functions
const _getEventAttr = attrName => e =>
  attrName in e.currentTarget
    ? e.currentTarget[ attrName ]
    : e.currentTarget.getAttribute( attrName )

// setOn may be appropriate here because _getEventAttr is waiting for the event
const setToAttr = attrName => lens => $ =>
  R.compose( setOn$( $ )( lens ) )
         ( _getEventAttr( attrName ) )

const setToValueAttr = setToAttr( 'value' )

const bindS = attrName => evtName => lens => atom => (
  { [ evtName ]: setToAttr( attrName )( lens )( atom )
  , [ attrName ]: view( lens )( atom )
  }
)

const bindSOn = attrName => evtName => atom => lens =>
  bindS( attrName )
       ( evtName )
       ( R.when( X.isUndefined )
             ( _ => [] )
             ( lens )
       )
       ( atom )

const laser =
  { view // tested
  , viewOn // tested
  , over // tested
  , over$
  , overOn // tested
  , overOn$
  , set // tested
  , set$
  , setOn // tested
  , setOn$
  , setToAttr
  , setToValueAttr
  , bindS
  , bindSOn
  , emptyStream // tested
  , makeStateContainer // tested
  , lensedAtom // partially tested
  }

module.exports = laser