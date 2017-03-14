/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/UserEdit.js

// import libraries
import m from 'mithril'
import * as X from 'xioup.main.utils'

// import model
import M from 'User/UserModel'

const UserEdit =
  { oninit: vn => M.loadItem( vn.attrs.id )
  , onremove: M.emptyObjectStream( M.item )
  , view: () =>
    <div>
      <label class="label">
        First Name
        <input
          class="input"
          type="text"
          placeholder="First Name"
          oninput={ X.setStreamPropToAttr( [ 'firstName' ], M.item, 'value' ) }
          value={ X.getStreamProp( [ 'firstName' ], M.item ) }
        />
      </label>
      <label class="label">
        Last Name
        <input
          class="input"
          type="text"
          placeholder="Last Name"
          oninput={ X.setStreamPropToAttr( [ 'lastName' ], M.item, 'value' ) }
          value={ X.getStreamProp( [ 'lastName' ], M.item ) }
        />
      </label>
      <button class="button" onclick={ M.validateAndSaveItem }>Save</button>
      &nbsp;
      <a class="button" href="/users/"  oncreate={ m.route.link }>Cancel</a>
    </div>
  }

module.exports = UserEdit
