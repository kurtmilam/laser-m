/**
 * Created by Kurt on 2017-03-14.
 */

import m from '../../utils/m-mock'
import flyd from 'flyd'
import * as laser from '../../utils/xioup.laser'

const state$ = flyd.stream( { data: {}, history: [], meta: {}, streams: {} } )
window.state$ = state$
const stateContainer = laser.makeStateContainer( state$ )
// const stateContainer = X.lensedAtom( [ 'data' ], state$, {} )
window.stateContainer = stateContainer
module.exports = stateContainer
