/**
 * Created by Kurt on 2017-03-16.
 */
// src/components/User/UserListRow.js

// import libraries
import m from '../../utils/m-mock'
import R from 'ramda'
import L from 'partial.lenses'
// import btn from 'polythene/button/button'
import * as X from '../../utils/xioup.main.utils'

// import model
import M from 'User/UserModel'

const matchProp = prop => x =>
  R.compose( R.equals( R.prop( prop, x ) ), R.prop( prop ) )
const removeListRow = x =>
  R.compose( M.updateRows( [] )( R.reject( matchProp( 'id' )( x ) ) ) )

module.exports = vn =>
    <div class={ `${ M.entityName }-list-item` } key={ vn.id }>
      <span>{ M.firstAndLastName( vn ) }</span>
      &nbsp;&nbsp;
      <a class="button" href={ X.showRowHref( M.entityName, vn ) } oncreate={ m.route.link }>View</a>
      &nbsp;&nbsp;
      <a class="button" href={ X.editRowHref( M.entityName, vn ) } oncreate={ m.route.link }>Edit</a>
      &nbsp;&nbsp;
      <button class="button" onclick={ _ => removeListRow( vn ) }>
        Remove
      </button>
      &nbsp;&nbsp;
      <btn label="polythene works!" raised={ true }/>
    </div>

