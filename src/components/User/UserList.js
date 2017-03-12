/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/UserList.js

// import libraries
import m from 'mithril'
import M from 'main.utils'
import C from 'User/user.utils'
import map from 'ramda/src/map'

// import model
import User from 'User/UserModel'

// components
const userRow =
  a =>
    <div class="user-list-item">
      <span>{ C.firstAndLastName( a ) }</span>
      &nbsp;&nbsp;
      <a class="button" href={ C.viewUserHref( a ) } oncreate={ M.routeLink }>View</a>
      &nbsp;&nbsp;
      <a class="button" href={ C.editUserHref( a ) } oncreate={ M.routeLink }>Edit</a>
    </div>

module.exports =
  { oninit: M.getLoadList( User )
  , view: () =>
      <div class="user-list">
        { map( userRow
             , M.getList( User )()
             )
        }
      </div>
  }
