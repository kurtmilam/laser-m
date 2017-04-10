/**
 * Created by Kurt on 2017-03-14.
 */

import * as laser from '../../utils/xioup.laser'

// const state$ = flyd.stream( { data: {}, history: [], meta: {}, streams: {} } )
const stateContainer = laser.makeStateContainer()
// const stateContainer = X.lensedAtom( [ 'data' ], state$, {} )
window.stateContainer = stateContainer
module.exports = stateContainer
