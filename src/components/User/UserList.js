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

import UserListRow from 'User/UserListItem'

const sortByO = [ 'sort', 'by' ]
const setSortBy = X.set( M.rowsUI_A_ )( sortByO )

// don't make the following point-free without testing, first
const drawRowNodes = rows =>
  R.compose( X.map( UserListRow )
           , X.sortByProp( X.get( M.rowsUI_A_ )( sortByO ) )
           )( rows )

// TODO: Apply transformations to state (rather than only in the view)? Probably not
module.exports =
  { oninit: _ => M.loadTable( M.rows_A_() )
  // , onremove: M.rows_A_.end()
  , view: vn =>
      <div
        class={ `${ M.entityName }-list` }>
        <btn label="polythene works!" raised={ true }/>
        <div
          class={ `${ M.entityName }-list-header` }>
          <label class="label">
            Filter
            <input class="input" type="text" placeholder="Type to Filter"
              oninput={ X.setToValueAttr( M.rowsUI_A_ )( [ 'filter', 'by' ] ) }
            />
          </label>
        </div>
        <div
          class={ `${ M.entityName }-list-header` }>
          <button class="button"
            onclick={ _ => setSortBy( [ 'data', 'id' ] ) }
          >Order By Id</button>
          &nbsp;&nbsp;
          <button class="button"
            onclick={ _ => setSortBy( [ 'data', 'lastName' ] ) }
          >Order By Last Name</button>
          &nbsp;&nbsp;
          <button class="button"
            onclick={ _ => setSortBy( [ 'data', 'firstName' ] ) }
          >Order By First Name</button>
          &nbsp;&nbsp;
          <button class="button"
            onclick={ _ => M.loadTableFromApi() }
          >Refresh</button>
        </div>
        { drawRowNodes( M.rows_A_() ) }
      </div>
  }
