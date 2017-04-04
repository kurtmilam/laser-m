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

const sortByOptic = [ 'sort', 'by' ]
// the returned function expects a string, not an optic
const sortBy = X.set( M.rowsUi$ )( sortByOptic )

const refreshTable =
  R.compose( M.loadTable, X.emptyStream )

const createRowNodes =
  R.compose( X.map( UserListRow ), X.sortByProp( M.selectRowsUi( sortByOptic ) ) )
  // R.compose( X.map( UserListRow ), R.compose( R.sort, R.ascend, R.prop )( M.selectRowsUi( sortByOptic ) ) )

// const createRowNodes = R.transduce( createRowNodesTransducer, X.appendTo, [] )

// TODO: Apply transformations to state (rather than only in the view)?
module.exports =
  { oninit: _ => M.loadTable( M.rows$() )
  // , onremove: M.rows$.end()
  , view: vn =>
      <div class={ `${ M.entityName }-list` }>
        <btn label="polythene works!" raised={ true }/>
        <div class={ `${ M.entityName }-list-header` }>
          <label class="label">
            Filter
            <input
              class="input"
              type="text"
              placeholder="Type to Filter"
              oninput={ M.setTableUiPropToValueAttr( [ 'filter', 'by' ] ) }
            />
          </label>
        </div>
        <div class={ `${ M.entityName }-list-header` }>
          <button class="button" onclick={ _ => sortBy( 'id' ) }>
            Order By Id
          </button>
          &nbsp;&nbsp;
          <button class="button" onclick={ _ => sortBy( 'firstName' ) }>
            Order By Last Name
          </button>
          &nbsp;&nbsp;
          <button class="button" onclick={ _ => sortBy( 'lastName' ) }>
            Order By First Name
          </button>
          &nbsp;&nbsp;
          <button class="button" onclick={ _ => refreshTable( M.rows$ ) }>
            Refresh
          </button>
        </div>
        { createRowNodes( M.rows$() ) }
      </div>
  }
