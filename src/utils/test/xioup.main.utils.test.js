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

// lensedStream Operations
describe( 'emptyStream()'
        , () => {
            const $ = flyd.stream( { a: 1 } )
            it( 'empties objects'
              , () => wish( equals( X.emptyStream( $ ), {} ) )
             )
            it( 'empties arrays'
              , () => wish( equals( X.emptyStream( $( [ 1, 2 ] ) ), [] ) )
             )
            it( 'empties strings'
              , () => wish( equals( X.emptyStream( $( 'string' ) ), '' ) )
             )
            after( 'End $', () => $.end() )
          }
       )

describe( 'get()'
        , () => {
            const $ = flyd.stream( { a: { b: 2 } } )
            it( 'returns the value at $[ lens ]'
              , () => wish( X.get( $ )( [ 'a', 'b' ] ) === 2 )
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
              , () => wish( equals( X.set( $ )( [ 'a', 'b' ] )( 3 ), o2 ) )
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
              , () => wish( equals( X.set( $ )( [ 'a', 'b' ] )( 3 ), o2 ) )
             )
            after( 'End $', () => $.end() )
          }
       )

describe( 'update()'
        , () => {
            const o1 = { a: { b: 2 } }
            const $ = flyd.stream( o1 )
            it( 'dispatches to "over" when value is a function'
              , () => wish( X.update( $ )( [ 'a', 'b' ] )( inc ).a.b === 3 )
             )
            it( 'dispatches to "set" when value is not a function'
              , () => wish( X.update( $ )( [ 'a', 'b' ] )( 0 ).a.b === 0 )
             )
            after( 'End $', () => $.end() )
          }
       )

// lensedStream
describe( 'lensedStream()'
        , () => {
            const o1 = {}
            const o2 = { test: 'firstValue' }
            const p1 = [ 'a' ]
            const p2 = [ 'a', 'b' ]
            const p3 = [ 'a', 'c' ]
            const init = { streams: {}, meta: {}, data: {} }
            const state = flyd.stream( init )
            const state1 = flyd.stream( init )
            const lensedStream = X.lensedStream( state )
            const stateSlice = lensedStream( p2, o1 )
            const stateSlice1 = lensedStream( p2, o1 )
            it( 'lensedStream() returns a function (fn)'
              , () => wish( X.isFunction( lensedStream ) )
             )
            it( 'fn( path, initialValue ) returns a flyd.stream'
              , () => wish( flyd.isStream( stateSlice ) )
             )
            it( 'fn( path, initialValue )() returns the initialValue'
              , () => wish( stateSlice() === o1 )
             )
            it( 'fn( path, initialValue ) results in state().data.path === state().streams[ path ]()'
              , () => wish( state().data.a.b === state().streams[ 'a.b' ]() )
             )
            it( 'only one lensedStream is created for a given optic'
              , () => wish( stateSlice === stateSlice1 )
             )
            it( 'updating a lensedStream returns a stream'
              , () => wish( flyd.isStream( stateSlice( o2 ) ) )
             )
            it( 'updating a lensedStream results in state().streams[ lsPath ]().path === state().data.path'
              , () => {
                  stateSlice( o2 )
                  wish( state().streams[ 'a.b' ]().test === state().data.a.b.test )
                }
             )
            it( 'updating a lensedStream results in lensedStream().path === state().data.path'
              , () => {
                  stateSlice( o2 )
                  wish( stateSlice().test === state().data.a.b.test )
                }
             )
            after( 'End all streams'
                 , () => {
                     state.end()
                     state1.end()
                     stateSlice.end()
                     stateSlice1.end()
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
            const state = flyd.stream( init )
            const state1 = flyd.stream( init )
            const stateSlice = X.lensedAtom( p2, state, o1 )
            const stateSlice1 = X.lensedAtom( p2, state, o1 )
            it( 'X.lensedAtom( path, streamOrAtom, initialValue ) returns a function (fn)'
              , () => wish( typeof stateSlice === 'function' )
             )
            // TODO: Confirm these tests and get them working
            /*
            it( 'fn( path, streamOrAtom, initialValue )() returns the initialValue'
              , () => wish( stateSlice() === o1 )
             )
            it( 'fn( path, streamOrAtom, initialValue ) results in state().data.path === state().atoms[ path ]()'
              , () => wish( state().data.a.b === state().atoms[ 'a.b' ]() )
             )
            it( 'only one lensedAtom is created for a given optic'
              , () => wish( stateSlice === stateSlice1 )
             )
            it( 'updating a lensedAtom returns a function'
              , () => wish( typeof stateSlice( o2 ) === 'function' )
             )
            it( 'updating a lensedAtom results in state().atoms[ lsPath ]().path === state().data.path'
              , () => {
                  stateSlice( o2 )
                  wish( state().atoms[ 'a.b' ]().test === state().data.a.b.test )
                }
             )
            it( 'updating a lensedStream results in fn().path === state().data.path'
              , () => {
                  stateSlice( o2 )
                  wish( stateSlice().test === state().data.a.b.test )
                }
             )
            */
            after( 'End all streams'
                 , () => {
                     state.end()
                     state1.end()
                    }
                 )
          }
       )
