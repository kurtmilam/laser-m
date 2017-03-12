/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/UserEdit.js

// import libraries
import m from 'mithril'
import * as L from 'partial.lenses'
import M from 'main.utils'
import C from 'User/user.utils'
import trim from 'ramda/src/trim'
import compose from 'ramda/src/compose'

// import model
import User from 'User/UserModel'

module.exports =
  { oninit: vnode => User.load( vnode.attrs.id )
  , view: () =>
    <div>
      <label class="label">
        First Name
        <input
          class="input"
          type="text"
          placeholder="First Name"
          oninput={ M.withValue( a => User.curr( C.setFirstName( a, User.curr() ) ) ) }
          value={ C.getFirstName( User.curr() ) }
        />
      </label>
      <label class="label">
        Last Name
        <input
          class="input"
          type="text"
          placeholder="Last Name"
          //oninput={ M.withValue( a => compose( User.curr
          //                                   , L.set( 'lastName', a )
          //                                   )( User.curr() )
          //                     )
          //        }
          oninput={ M.withValue( a => User.curr( C.setLastName( a, User.curr() ) ) ) }
          // oninput={ M.withValue( compose( User.curr, L.set( 'lastName' ) ) )( User.curr() ) }
          // oninput={ M.withValue( compose( User.curr, L.set( 'lastName' ) ) )( User.curr() ) }
          value={ C.getLastName( User.curr() ) }
        />
      </label>
      <button class="button" onclick={ User.save }>Save</button>
      &nbsp;
      <a class="button" href="/users/"  oncreate={ M.routeLink }>Cancel</a>
    </div>
  }
