/**
 * Created by Kurt on 2017-04-10.
 */

// import libraries
import wish from 'wish'
// import sinon from 'sinon'
import equals from 'ramda/src/equals'
import inc from 'ramda/src/inc'
import flyd from 'flyd'

import * as X from '../xioup.main.utils'
import * as laser from '../xioup.laser'

// stateContainer Operations
describe( 'emptyStream()'
        , () => {
            const $ = flyd.stream( { a: 1 } )
            it( 'empties objects'
              , () => wish( equals( laser.emptyStream( [] )( $ ), {} ) )
             )
            it( 'empties arrays'
              , () => wish( equals( laser.emptyStream( [] )( $( [ 1, 2 ] ) ) ) )
             )
            it( 'empties strings'
              , () => wish( equals( laser.emptyStream( [] )( $( 'string' ) ), '' ) )
             )
            after( 'End $', () => $.end() )
          }
       )

describe( 'view()'
        , () => {
            const $ = flyd.stream( { a: { b: 2 } } )
            it( 'returns the value at $[ lens ]'
              , () => wish( laser.view( [ 'a', 'b' ] )( $ ) === 2 )
             )
            after( 'End $', () => $.end() )
          }
       )

describe( 'viewOn()'
        , () => {
            const $ = flyd.stream( { a: { b: 2 } } )
            it( 'returns the value at $[ lens ]'
              , () => wish( laser.viewOn( $ )( [ 'a', 'b' ] ) === 2 )
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
              , () => wish( equals( laser.over( [ 'a', 'b' ] )( inc )( $ ), o2 ) )
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
              , () => wish( equals( laser.overOn( $ )( [ 'a', 'b' ] )( inc ), o2 ) )
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
              , () => wish( equals( laser.set( [ 'a', 'b' ] )( 3 )( $ ), o2 ) )
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
              , () => wish( equals( laser.setOn( $ )( [ 'a', 'b' ] )( 3 ), o2 ) )
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
            const stateContainer = laser.makeStateContainer( state$ )
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
            const stateSlice$ = laser.lensedAtom( p2, state$, o1 )
            const stateSlice1$ = laser.lensedAtom( p2, state$, o1 )
            it( 'laser.lensedAtom( path, streamOrAtom, initialValue ) returns a function (fn)'
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
