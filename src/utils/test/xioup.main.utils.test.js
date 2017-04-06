/**
 * Created by Kurt on 2017-03-24.
 */

// import libraries
import wish from 'wish'
import sinon from 'sinon'
import compose from 'ramda/src/compose'
import equals from 'ramda/src/equals'
import inc from 'ramda/src/inc'
import * as L from 'partial.lenses'
import flyd from 'flyd'

import X from '../xioup.main.utils'

// CLI: mocha --compilers js:babel-core/register --recursive src/utils/test/xioup.main.utils.test.js

describe( 'showRowHref()'
        , () => {
            it( 'makes show item href'
              , () => wish( '/item/1' === X.showRowHref( 'item' )( { id: 1 } ) )
             )
          }
       )

describe( 'editRowHref()'
        , () => {
            it( 'makes edit item href'
              , () => wish( '/item/1/edit' === X.editRowHref( 'item' )( { id: 1 } ) )
             )
          }
       )

// stateContainer Operations
describe( 'emptyStream()'
        , () => {
            const $ = flyd.stream( { a: 1 } )
            it( 'empties objects'
              , () => wish( equals( X.emptyStream( [] )( $ ), {} ) )
             )
            it( 'empties arrays'
              , () => wish( equals( X.emptyStream( [] )( $( [ 1, 2 ] ) ) ) )
             )
            it( 'empties strings'
              , () => wish( equals( X.emptyStream( [] )( $( 'string' ) ), '' ) )
             )
            after( 'End $', () => $.end() )
          }
       )

describe( 'view()'
        , () => {
            const $ = flyd.stream( { a: { b: 2 } } )
            it( 'returns the value at $[ lens ]'
              , () => wish( X.view( [ 'a', 'b' ] )( $ ) === 2 )
             )
            after( 'End $', () => $.end() )
          }
       )

describe( 'viewOn()'
        , () => {
            const $ = flyd.stream( { a: { b: 2 } } )
            it( 'returns the value at $[ lens ]'
              , () => wish( X.viewOn( $ )( [ 'a', 'b' ] ) === 2 )
             )
            after( 'End $', () => $.end() )
          }
       )

describe( 'over()'
        , () => {
            const o1 = { a: { b: 2 } }
            const o2 = { a: { b: 3 } }
            const $ = flyd.stream( o1 )
            it( 'sets $[ lens ] to fn( $[ lens ] )'
              , () => wish( equals( X.over( [ 'a', 'b' ] )( inc )( $ ), o2 ) )
              )
            after( 'End $', () => $.end() )
          }
       )

describe( 'overOn()'
        , () => {
            const o1 = { a: { b: 2 } }
            const o2 = { a: { b: 3 } }
            const $ = flyd.stream( o1 )
            it( 'sets $[ lens ] to fn( $[ lens ] )'
              , () => wish( equals( X.overOn( $ )( [ 'a', 'b' ] )( inc ), o2 ) )
              )
            after( 'End $', () => $.end() )
          }
       )

describe( 'set()'
        , () => {
            const o1 = { a: { b: 2 } }
            const o2 = { a: { b: 3 } }
            const $ = flyd.stream( o1 )
            it( 'sets $[ lens ] to value'
              , () => wish( equals( X.set( [ 'a', 'b' ] )( 3 )( $ ), o2 ) )
              )
            after( 'End $', () => $.end() )
          }
       )

describe( 'setOn()'
        , () => {
            const o1 = { a: { b: 2 } }
            const o2 = { a: { b: 3 } }
            const $ = flyd.stream( o1 )
            it( 'sets $[ lens ] to value'
              , () => wish( equals( X.setOn( $ )( [ 'a', 'b' ] )( 3 ), o2 ) )
             )
            after( 'End $', () => $.end() )
          }
       )

describe( 'update()'
        , () => {
            const o1 = { a: { b: 2 } }
            const $ = flyd.stream( o1 )
            it( 'dispatches to "over" when value is a function'
              , () => wish( X.update( [ 'a', 'b' ] )( inc )( $ ).a.b === 3 )
             )
            it( 'dispatches to "set" when value is not a function'
              , () => wish( X.update( [ 'a', 'b' ] )( 0 )( $ ).a.b === 0 )
             )
            after( 'End $', () => $.end() )
          }
       )

describe( 'updateOn()'
        , () => {
            const o1 = { a: { b: 2 } }
            const $ = flyd.stream( o1 )
            it( 'dispatches to "over" when value is a function'
              , () => wish( X.updateOn( $ )( [ 'a', 'b' ] )( inc ).a.b === 3 )
             )
            it( 'dispatches to "set" when value is not a function'
              , () => wish( X.updateOn( $ )( [ 'a', 'b' ] )( 0 ).a.b === 0 )
             )
            after( 'End $', () => $.end() )
          }
       )

// stateContainer
describe( 'stateContainer()'
        , () => {
            const o1 = {}
            const o2 = { test: 'firstValue' }
            const p1 = [ 'a' ]
            const p2 = [ 'a', 'b' ]
            const p3 = [ 'a', 'c' ]
            const init = { streams: {}, meta: {}, data: {} }
            const state$ = flyd.stream( init )
            const state1$ = flyd.stream( init )
            const stateContainer = X.stateContainer( state$ )
            const stateSlice$ = stateContainer( p2, o1 )
            const stateSlice1$ = stateContainer( p2, o1 )
            it( 'stateContainer() returns a function (fn)'
              , () => wish( X.isFunction( stateContainer ) )
             )
            it( 'fn( path, initialValue ) returns a flyd.stream'
              , () => wish( flyd.isStream( stateSlice$ ) )
             )
            it( 'fn( path, initialValue )() returns the initialValue'
              , () => wish( stateSlice$() === o1 )
             )
            it( 'fn( path, initialValue ) results in state$().data.path === state$().streams[ path ]()'
              , () => wish( state$().data.a.b === state$().streams[ 'a.b' ]() )
             )
            it( 'only one stateContainer is created for a given lens'
              , () => wish( stateSlice$ === stateSlice1$ )
             )
            it( 'updating a stateContainer returns a stream'
              , () => wish( flyd.isStream( stateSlice$( o2 ) ) )
             )
            it( 'updating a stateContainer results in state$().streams[ lsPath ]().path === state$().data.path'
              , () => {
                  stateSlice$( o2 )
                  wish( state$().streams[ 'a.b' ]().test === state$().data.a.b.test )
                }
             )
            it( 'updating a stateContainer results in stateContainer().path === state$().data.path'
              , () => {
                  stateSlice$( o2 )
                  wish( stateSlice$().test === state$().data.a.b.test )
                }
             )
            after( 'End all streams'
                 , () => {
                     state$.end()
                     state1$.end()
                     stateSlice$.end()
                     stateSlice1$.end()
                    }
                 )
          }
       )

// lensedAtom
describe( 'lensedAtom()'
        , () => {
            const o1 = {}
            const o2 = { test: 'firstValue' }
            const p1 = [ 'a' ]
            const p2 = [ 'a', 'b' ]
            const p3 = [ 'a', 'c' ]
            const init = { streams: {}, meta: {}, data: {} }
            const state$ = flyd.stream( init )
            const state1$ = flyd.stream( init )
            const stateSlice$ = X.lensedAtom( p2, state$, o1 )
            const stateSlice1$ = X.lensedAtom( p2, state$, o1 )
            it( 'X.lensedAtom( path, streamOrAtom, initialValue ) returns a function (fn)'
              , () => wish( typeof stateSlice$ === 'function' )
             )
            // TODO: Confirm these tests and get them working
            /*
            it( 'fn( path, streamOrAtom, initialValue )() returns the initialValue'
              , () => wish( stateSlice$() === o1 )
             )
            it( 'fn( path, streamOrAtom, initialValue ) results in state$().data.path === state$().atoms[ path ]()'
              , () => wish( state$().data.a.b === state$().atoms[ 'a.b' ]() )
             )
            it( 'only one lensedAtom is created for a given lens'
              , () => wish( stateSlice$ === stateSlice1$ )
             )
            it( 'updating a lensedAtom returns a function'
              , () => wish( typeof stateSlice$( o2 ) === 'function' )
             )
            it( 'updating a lensedAtom results in state$().atoms[ lsPath ]().path === state$().data.path'
              , () => {
                  stateSlice$( o2 )
                  wish( state$().atoms[ 'a.b' ]().test === state$().data.a.b.test )
                }
             )
            it( 'updating a stateContainer results in fn().path === state$().data.path'
              , () => {
                  stateSlice$( o2 )
                  wish( stateSlice$().test === state$().data.a.b.test )
                }
             )
            */
            after( 'End all streams'
                 , () => {
                     state$.end()
                     state1$.end()
                    }
                 )
          }
       )
