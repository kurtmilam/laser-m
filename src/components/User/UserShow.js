/**
 * Created by Kurt on 2017-03-10.
 */
// src/components/User/UserShow.js

// import libraries
import m from 'mithril'
import * as L from 'partial.lenses'
import X from  'xioup.main.utils'
import compose from 'ramda/src/compose'

// import model
import M from 'User/UserModel'

const UserShow =
  { oninit: vn => M.loadItem( vn.attrs.id )
  , onremove: M.emptyObjectStream( M.item )
  , view: () =>
    <div>
      { M.firstAndLastName( M.item() ) }
    </div>
  }

module.exports = UserShow
