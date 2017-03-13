/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/UserList.js

// import libraries
import m from 'mithril'
import X from 'xioup.main.utils'
// import btn from 'polythene/button/button'
import map from 'ramda/src/map'

// import model
import M from 'User/UserModel'

const showUserHref = X.showItemHref( 'users' )
const editUserHref = X.editItemHref( 'users' )

// components
const UserRow = a =>
  <div class="user-list-item">
    <span>{ M.firstAndLastName( a ) }</span>
    &nbsp;&nbsp;
    <a class="button" href={ showUserHref( a ) } oncreate={ m.route.link }>View</a>
    &nbsp;&nbsp;
    <a class="button" href={ editUserHref( a ) } oncreate={ m.route.link }>Edit</a>
    &nbsp;&nbsp;
    <btn label="IT FINALLY WORKS!" raised={ true }/>
  </div>

const UserList =
  { oninit: M.loadItemList
  , view: () =>
      <div class="user-list">
        <btn label="IT FINALLY WORKS!" raised={ true }/>
        { map( UserRow, M.itemList() ) }
      </div>
  }

module.exports = UserList
