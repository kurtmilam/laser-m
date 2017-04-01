/**
 * Created by Kurt on 2017-03-24.
 */

// import libraries
import wish from 'wish'
import sinon from 'sinon'
import always from 'ramda/src/always'
import compose from 'ramda/src/compose'
import equals from 'ramda/src/equals'
import inc from 'ramda/src/inc'
import * as L from 'partial.lenses'
import flyd from 'flyd'

import X from '../xioup.main.utils'

// CLI: mocha --compilers js:babel-core/register --recursive src/utils/test/xioup.main.utils.test.js

describe( 'showItemHref()'
        , () => {
            it( 'makes show item href'
              , () => wish( '/item/1' === X.showItemHref( 'item' )( { id: 1 } ) )
              )
          }
        )

describe( 'editItemHref()'
        , () => {
            it( 'makes edit item href'
              , () => wish( '/item/1/edit' === X.editItemHref( 'item' )( { id: 1 } ) )
              )
          }
        )

// lensedStream Operations
describe( 'emptyStream()'
        , () => {
            const stream = flyd.stream( { a: 1 } )
            it( 'empties objects'
              , () => wish( equals( X.emptyStream( stream ), {} ) )
              )
            it( 'empties arrays'
              , () => wish( equals( X.emptyStream( stream( [ 1, 2 ] ) ), [] ) )
              )
            it( 'empties strings'
              , () => wish( equals( X.emptyStream( stream( 'string' ) ), '' ) )
              )
            after( 'End stream', () => stream.end() )
          }
        )

describe( 'getStreamProp()'
        , () => {
            const stream = flyd.stream( { a: { b: 2 } } )
            it( 'partial application works'
              , () => wish( X.getStreamProp( stream )( [ 'a', 'b' ] ) === 2 )
              )
            after( 'End stream', () => stream.end() )
          }
        )

describe( 'modifyStreamProp()'
        , () => {
            const o1 = { a: { b: 2 } }
            const stream = flyd.stream( o1 )
            it( 'partial application works'
              , () => wish( X.modifyStreamProp( stream )( [ 'a', 'b' ] )( inc ).a.b === 3 )
              )
            it( 'set works'
              , () => wish( X.modifyStreamProp( stream )( [ 'a', 'b' ] )( always( 1 ) ).a.b === 1 )
              )
            after( 'End stream', () => stream.end() )
          }
        )

describe( 'setStreamProp()'
        , () => {
            const o1 = { a: { b: 2 } }
            const o2 = { a: { b: 3 } }
            const stream = flyd.stream( o1 )
            it( 'partial application works'
              , () => wish( equals( X.setStreamProp( stream )( [ 'a', 'b' ] )( 3 ), o2 ) )
              )
            after( 'End stream', () => stream.end() )
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
              , () => wish( stateSlice() === o1  )
              )
            it( 'fn( path, initialValue ) results in state().data.path === state().stream[ path ]()'
              , () => wish( state().data.a.b === state().streams[ 'a.b' ]() )
              )
            it( 'only one lensedStream is created for a given optic'
              , () => wish( stateSlice === stateSlice1 )
              )
            it( 'updating a lensedStream returns a stream'
              , () => wish( flyd.isStream( stateSlice( o2 ) ) )
              )
            it( 'updating a lensedStream results in stream().streams[ lsPath ]().path === state().data.path'
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
