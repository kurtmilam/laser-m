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

const sortByL = [ 'sort', 'by' ]
const setSortBy = X.setOn$( M.rowsUIA )( sortByL )

// don't make the following point-free without testing, first
const drawRowNodes = rows =>
  X.compose( X.map( UserListRow ) )
           ( X.sortAscByProp( X.viewOn( M.rowsUIA )
                                      ( sortByL )
                            )
           )
           ( rows )


// TODO: Apply transformations to stateContainer (rather than only in the view)? Probably not
module.exports =
  { oninit: _ => M.loadTable( M.rowsA() )
  // , onremove: M.rowsA.end()
  , view: vn =>
      <div
        class={ `${ M.entityName }-list` }>
        <btn label="polythene works!" raised={ true }/>
        <div
          class={ `${ M.entityName }-list-header` }>
          <label class="label">
            Filter
            <input class="input" type="text" placeholder="Not Working Yet"
              oninput={ X.setToValueAttr( [ 'filter', 'by' ] )( M.rowsUIA ) }
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
        { drawRowNodes( M.rowsA() ) }
      </div>
  }
