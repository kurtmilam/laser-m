/**
 * Created by Kurt on 2017-03-10.
 */
// src/components/User/UserShow.js

// import libraries
import m from 'mithril'
import M from 'main.utils'
import C from 'User/user.utils'
import compose from 'ramda/src/compose'

// import model
import User from 'User/UserModel'

// mithril

module.exports =
  { oninit: vnode => User.load( compose( M.getId, M.getAttrs )( vnode ) )
  , view: () =>
    <div>
      { C.firstAndLastName( User.curr() ) }
    </div>
  }
