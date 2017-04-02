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

const sortByOptic = [ 'sort', 'by' ]
const sortBy = X.setStreamProp( M.itemListUi )( sortByOptic )

const refreshItemList =
  R.compose( M.loadItemList, X.emptyStream )

// TODO: Apply transformations to state (rather than only in the view)?
module.exports =
  { oninit: _ => M.loadItemList( M.itemList() )
  // , onremove: M.itemList.end()
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
              oninput={ M.setItemListUiPropToValueAttr( [ 'filter', 'by' ] ) }
            />
          </label>
        </div>
        <div class={ `${ M.itemName }-list-header` }>
          <button class="button" onclick={ _ => sortBy( [ 'model', 'id' ] ) }>
            Order By Id
          </button>
          &nbsp;&nbsp;
          <button class="button" onclick={ _ => sortBy( [ 'model', 'firstName' ] ) }>
            Order By Last Name
          </button>
          &nbsp;&nbsp;
          <button class="button" onclick={ _ => sortBy( [ 'model', 'lastName' ] ) }>
            Order By First Name
          </button>
          &nbsp;&nbsp;
          <button class="button" onclick={ _ => refreshItemList( M.itemList ) }>
            Refresh
          </button>
        </div>
        { R.map( UserListItem )( X.sortByProp( M.getItemListUiProp( sortByOptic ) )( M.itemList() ) ) }
      </div>
  }
