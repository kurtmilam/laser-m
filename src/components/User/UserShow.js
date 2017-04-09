/**
 * Created by Kurt on 2017-03-10.
 */
// src/components/User/UserShow.js

// import libraries
import m from '../../utils/m-mock'
import * as X from '../../utils/xioup.main.utils'

// import model
import M from 'User/UserModel'

const UserShow =

  { oninit: vn =>
      { // console.log( vn )
        const id = Number( vn.attrs.id )
        const state = M.state
        const rowL = M.getRowL( id )
        const dataL = [ rowL, 'data' ]
        // const atom = X.lensedAtom( M.getRowL( id ), M.state )
        vn.state = { id
                   , state
                   // , atom
                   , rowL
                   , dataL
                   }
      }
  , view: vn =>
    <div>
      { M.listRowLabel( X.view( M.dataL, M.state ) ) }
      { /* M.listRowLabel( vn.state.atom() ) */ }
    </div>
  }

module.exports = UserShow
