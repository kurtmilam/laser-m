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

const sortByOptic = [ 'sort ', 'by' ]

module.exports =
  { oninit: M.loadItemList
  , onremove: M.itemList.end()
  , view: vn =>
      <div class={ `${ M.itemName }-list` }>
        <btn label="polythene works!" raised={ true }/>
        <div class={ `${ M.itemName }-list-header` }>
          <label class="label">
            Filter
            <input
              class="input"
              type="text"
              placeholder="Type to Filter"
              oninput={ M.setItemListUiPropToValueAttr( 'filter' ) }
            />
          </label>
        </div>
        <div class={ `${ M.itemName }-list-header` }>
          <button class="button" onclick={ () => X.setStreamProp( M.itemListUi, sortByOptic, 'id' ) }>
            Order By Id
          </button>
          &nbsp;&nbsp;
          <button class="button" onclick={ () => X.setStreamProp( M.itemListUi, sortByOptic, 'lastName' ) }>
            Order By Last Name
          </button>
          &nbsp;&nbsp;
          <button class="button" onclick={ () => X.setStreamProp( M.itemListUi, sortByOptic, 'firstName' ) }>
            Order By First Name
          </button>
          &nbsp;&nbsp;
          <button class="button" onclick={ M.loadItemListFromApi }>
            Refresh
          </button>
        </div>
        { R.map( UserListItem )( X.sortByProp( M.getItemListUiProp( sortByOptic ) )( M.itemList() ) ) }
      </div>
  }
