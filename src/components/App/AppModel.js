/**
 * Created by Kurt on 2017-03-14.
 */

import m from '../../utils/m-mock'
import flyd from 'flyd'
import * as L from 'partial.lenses'
import * as X from '../../utils/xioup.main.utils'

//const stateTest = L.set( [ 'X', 'path' ], flyd.stream( {} ), '' )
const stateStream = flyd.stream( { streams: {}, meta: {}, data: {} } )
window.stateStream = stateStream

/*
const o = { a: { b: 1 } }
const test = flyd.stream( o )
const test1 = X.stateContainer( test )( [ 'a' ], {} )
const test2 = X.stateContainer( test )( [ 'a' ], {} )
X.set( test, [ 'b' ] )( 2 )
console.log( 'test1(), test2()', test1(), test2() )
console.log( 'test1() === test2()', test1() === test2() )
console.log( 'test()', test() )
*/

module.exports = X.stateContainer( stateStream )
