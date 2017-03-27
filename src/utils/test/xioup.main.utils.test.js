/**
 * Created by Kurt on 2017-03-24.
 */

// import libraries
import wish from 'wish'
import sinon from 'sinon'
import equals from 'ramda/src/equals'
import * as L from 'partial.lenses'
import flyd from 'flyd'

import X from '../xioup.main.utils'


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
describe( 'getStreamProp()'
        , () => {
            const stream = flyd.stream( { a: { b: 2 } } )
            it( 'full application works'
              , () => wish( X.getStreamProp( stream, [ 'a', 'b' ] ) === 2 )
              )

            it( 'partial application works'
              , () => wish( X.getStreamProp( stream )( [ 'a', 'b' ] ) === 2 )
              )
            after( 'End stream', () => stream.end() )
          }
        )

describe( 'setStreamProp()'
        , () => {
            const o1 = { a: { b: 2 } }
            const o2 = { a: { b: 3 } }
            const stream = flyd.stream( o1 )
            it( 'full application works'
              , () => wish( equals( X.setStreamProp( stream, [ 'a', 'b' ] )( 3 ), o2 ) )
              )

            it( 'partial application works'
              , () => wish( equals( X.setStreamProp( stream )( [ 'a', 'b' ] )( 2 ), o1 ) )
              )
            after( 'End stream', () => stream.end() )
          }
        )

describe( 'emptyStream()'
        , () => {
            const streamObj = flyd.stream( { a: 1 } )
            const streamArr = flyd.stream( [ 1, 2 ] )
            const streamStr = flyd.stream( 'string' )
            it( 'empties objects'
              , () => wish( equals( X.emptyStream( streamObj )(), {} ) )
              )
            it( 'empties arrays'
              , () => wish( equals( X.emptyStream( streamArr )(), [] ) )
              )
            it( 'empties strings'
              , () => wish( equals( X.emptyStream( streamStr )(), '' ) )
              )
            after( 'End all streams'
                 , () => {
                     streamObj.end()
                     streamArr.end()
                     streamStr.end()
                    }
                  )
          }
        )
