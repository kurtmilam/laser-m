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
      const atom = M.getById( id )
      // console.log( atom() )
      // typeof atom() === 'undefined' if no match is found
      const data = X.lensedAtom( [ 'data' ], atom, {} )
      // L.set(  )
      vn.state = { id
                 , atom
                 , data
                 }
      // window.vnstate = vn.stateContainer
    }
  // , onremove: M.item.end()
  , view: vn =>
    <div>
      { M.listRowLabel( vn.state.atom() ) }
    </div>
  }

module.exports = UserShow
