/**
 * Created by Kurt on 2017-03-16.
 */
// src/components/User/UserListItem.js

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
const matchId = matchProp( 'id' )

module.exports = vn =>
    <div class={ `${ M.itemName }-list-item` } key={ vn.id }>
      <span>{ M.firstAndLastName( vn ) }</span>
      &nbsp;&nbsp;
      <a class="button" href={ X.showItemHref( M.itemName, vn ) } oncreate={ m.route.link }>View</a>
      &nbsp;&nbsp;
      <a class="button" href={ X.editItemHref( M.itemName, vn ) } oncreate={ m.route.link }>Edit</a>
      &nbsp;&nbsp;
      <button class="button" onclick={ () => M.modifyItemList( R.reject( matchProp( 'id' )( vn ) ) ) }>
        Remove
      </button>
      &nbsp;&nbsp;
      <btn label="polythene works!" raised={ true }/>
    </div>

