/**
 * Created by Kurt on 2017-03-14.
 */

import m from '../../utils/m-mock'
import flyd from 'flyd'
import * as X from '../../utils/xioup.main.utils'

const state$ = flyd.stream( { streams: {}, meta: {}, data: {} } )
window.state$ = state$
const stateContainer = X.makeStateContainer( state$ )
window.stateContainer = stateContainer
module.exports = stateContainer
