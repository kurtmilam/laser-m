/**
 * Created by Kurt on 2017-03-16.
 */
// src/components/User/UserListRow.js

// import libraries
import m from '../../utils/m-mock'
import * as R from 'xioup.ramda'
// import btn from 'polythene/button/button'
import * as X from '../../utils/xioup.main.utils'
import * as laser from '../../utils/xioup.laser'

// import model
import M from 'User/UserModel'

const removeListRow =
  R.compose( laser.overOn$( M.state )( M.rowsL ) )
             ( R.compose( R.reject )
                          ( R.eqProps )
             )

module.exports = vn =>
    <div
      class={ `${ M.entityName }-list-item list-item` }
      key={ vn.id }>
      <div class="list-item-label">
        { M.listRowLabel( vn ) }
      </div>
      <div class="list-item-buttons">
        <a class="button"
           href={ X.showRowHref( M.entityName )( vn ) }
           oncreate={ m.route.link }
        >View</a>
        <a class="button"
           href={ X.editRowHref( M.entityName )( vn ) }
           oncreate={ m.route.link }
        >Edit</a>
        <button class="button"
                onclick={ _ => removeListRow( 'id', vn ) }
        >Remove</button>
        <btn label="polythene works!" raised={ true }/>
      </div>
    </div>
