/**
 * Created by Kurt on 2017-03-16.
 */
// src/components/User/UserListRow.js

// import libraries
import m from '../../utils/m-mock'
import * as R__ from 'xioup.ramda'
import R from 'ramda'
// import btn from 'polythene/button/button'
import * as X from '../../utils/xioup.main.utils'
import * as laser from '../../utils/xioup.laser'

// import model
import M from 'User/UserModel'

const removeListRow =
  R__.compose( laser.overOn$( M.state )( M.rowsL ) )
             ( R__.compose( R.reject )
                          ( R.eqProps )
             )

module.exports = vn =>
    <div
      class={ `${ M.entityName }-list-item` }
      key={ vn.id }>
      <span>
        { M.listRowLabel( vn ) }
      </span>
      &nbsp;&nbsp;
      <a class="button"
         href={ X.showRowHref( M.entityName )( vn ) }
         oncreate={ m.route.link }
      >View</a>
      &nbsp;
      <a class="button"
         href={ X.editRowHref( M.entityName )( vn ) }
         oncreate={ m.route.link }
      >Edit</a>
      &nbsp;
      <button class="button"
              onclick={ _ => removeListRow( 'id', vn ) }
      >Remove</button>
      &nbsp;
      <btn label="polythene works!" raised={ true }/>
    </div>
