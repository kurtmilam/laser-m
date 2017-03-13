/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/UserEdit.js

// import libraries
import m from 'mithril'
import * as L from 'partial.lenses'
import X from 'xioup.main.utils'

// import model
import M from 'User/UserModel'

const UserEdit =
  { oninit: vn => M.loadItem( vn.attrs.id )
  , onremove: M.emptyItem
  , view: () =>
    <div>
      <label class="label">
        First Name
        <input
          class="input"
          type="text"
          placeholder="First Name"
          oninput={ X.withValueAttr( a => M.item( M.setFirstName( a, M.item() ) ) ) }
          value={ M.getFirstName( M.item() ) }
        />
      </label>
      <label class="label">
        Last Name
        <input
          class="input"
          type="text"
          placeholder="Last Name"
          //oninput={ X.withValueAttr( a => compose( M.item
          //                                   , L.set( 'lastName', a )
          //                                   )( M.item() )
          //                     )
          //        }
          oninput={ X.withValueAttr( a => M.item( M.setLastName( a, M.item() ) ) ) }
          // oninput={ X.withValueAttr( compose( M.item, L.set( 'lastName' ) ) )( M.item() ) }
          // oninput={ X.withValueAttr( compose( M.item, L.set( 'lastName' ) ) )( M.item() ) }
          value={ M.getLastName( M.item() ) }
        />
      </label>
      <button class="button" onclick={ M.validateAndSaveItem }>Save</button>
      &nbsp;
      <a class="button" href="/users/"  oncreate={ m.route.link }>Cancel</a>
    </div>
  }

module.exports = UserEdit
