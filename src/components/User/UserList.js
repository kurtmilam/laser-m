/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/UserList.js

// import libraries
import m from 'mithril'
import R from 'ramda'
// import btn from 'polythene/button/button'
import * as X from 'xioup.main.utils'

// import model
import M from 'User/UserModel'

// components
const UserListItem = child =>
  <div class={ `${ M.itemName }-list-item` }>
    <span>{ M.firstAndLastName( child ) }</span>
    &nbsp;&nbsp;
    <a class="button" href={ X.showItemHref( M.itemName, child ) } oncreate={ m.route.link }>View</a>
    &nbsp;&nbsp;
    <a class="button" href={ X.editItemHref( M.itemName, child ) } oncreate={ m.route.link }>Edit</a>
    &nbsp;&nbsp;
    <btn label="IT FINALLY WORKS!" raised={ true }/>
  </div>

module.exports =
  { oninit: M.loadItemList
  , view: vn =>
      <div class={ `${ M.itemName }-list` }>
        <btn label="IT FINALLY WORKS!" raised={ true }/>
        { R.map( UserListItem, M.itemList() ) }
      </div>
  }
