/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/UserEdit.js

// import libraries
import m from 'mithril'
import * as X from 'xioup.main.utils'

// import model
import M from 'User/UserModel'

module.exports =
  { oninit: vn => M.loadItem( vn.attrs.id )
  , onremove: X.emptyStream( M.item )
  , view: () =>
    <div>
      <label class="label">
        First Name
        <input
          class="input"
          type="text"
          placeholder="First Name"
          oninput={ X.setStreamPropToAttr( 'firstName', M.item, 'value' ) }
          value={ X.getStreamProp( 'firstName', M.item ) }
        />
      </label>
      <label class="label">
        Last Name
        <input
          class="input"
          type="text"
          placeholder="Last Name"
          oninput={ X.setStreamPropToAttr( 'lastName', M.item, 'value' ) }
          value={ X.getStreamProp( 'lastName', M.item ) }
        />
      </label>
      <button class="button" onclick={ M.validateAndSaveItem }>Save</button>
      &nbsp;
      <a class="button" href={ `/${ M.itemName }/` }  oncreate={ m.route.link }>Cancel</a>
    </div>
  }
