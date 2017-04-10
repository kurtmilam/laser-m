/**
 * Created by Kurt on 2017-03-24.
 */

// import libraries
import wish from 'wish'
// import sinon from 'sinon'

import * as X from '../xioup.main.utils'

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
