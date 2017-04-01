/**
 * Created by Kurt on 2017-03-10.
 */
// src/components/User/UserShow.js

// import libraries
import m from '../../utils/m-mock'

// import model
import M from 'User/UserModel'
import * as X from '../../utils/xioup.main.utils'

const UserShow =
  { oninit: vn => M.loadItem( vn.attrs.id )
  // , onremove: M.item.end()
  , view: () =>
    <div>
      { M.firstAndLastName( M.item() ) }
    </div>
  }

module.exports = UserShow
