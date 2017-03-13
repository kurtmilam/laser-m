/**
 * Created by Kurt on 2017-03-10.
 */
// src/components/User/UserShow.js

// import libraries
import m from 'mithril'
import X from  'xioup.main.utils'
import compose from 'ramda/src/compose'

// import model
import M from 'User/UserModel'

const UserShow =
  { oninit: vnode => M.loadItem( compose( X.log, X.getId, X.getAttrs )( vnode ) )
  , onremove: M.emptyItem
  , view: () =>
    <div>
      { M.firstAndLastName( M.item() ) }
    </div>
  }

module.exports = UserShow
