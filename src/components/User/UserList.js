/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/UserList.js

// import libraries
import m from '../../utils/m-mock'
import R from 'ramda'
// import btn from 'polythene/button/button'
import * as X from '../../utils/xioup.main.utils'

// import model
import M from 'User/UserModel'

import UserListItem from 'User/UserListItem'

module.exports =
  { oninit: M.loadItemList
  , onremove: M.itemList.end()
  , view: vn =>
      <div class={ `${ M.itemName }-list` }>
        <btn label="polythene works!" raised={ true }/>
        <div class={ `${ M.itemName }-list-header` }>
          <button class="button" onclick={ () => M.modifyItemList( R.sort( R.ascend( R.prop( 'id' ) ) ) ) }>
            Order By Id
          </button>
          &nbsp;&nbsp;
          <button class="button" onclick={ () => M.modifyItemList( R.sort( R.ascend( R.prop( 'lastName' ) ) ) ) }>
            Order By Last Name
          </button>
          &nbsp;&nbsp;
          <button class="button" onclick={ () => M.modifyItemList( R.sort( R.ascend( R.prop( 'firstName' ) ) ) ) }>
            Order By First Name
          </button>
        </div>
        { R.map( UserListItem, M.itemList() ) }
      </div>
  }
