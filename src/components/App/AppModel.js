/**
 * Created by Kurt on 2017-03-14.
 */
// import Stream from 'mithril/stream'

// const state = Stream( {} )

import flyd from 'flyd'
// import * as L from 'partial.lenses'
import * as X from 'xioup.main.utils'

//const stateTest = L.set( [ 'X', 'path' ], flyd.stream( {} ), '' )
const state = flyd.stream( { streams: {}, meta: {}, data: {} } )
window.state = state


/*
const o = { a: { b: 1 } }
const test = flyd.stream( o )
const test1 = X.lensedStream( 'a', test, {} )
const test2 = X.lensedStream( 'a', test, {} )
X.updateStreamProp( L.set( 'b' ), test2 )( 2 )
console.log( 'test1(), test2()', test1(), test2() )
console.log( 'state.X.path', state.X.path )
*/

module.exports = X.lensedStream( state )
