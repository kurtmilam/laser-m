/**
 * Created by Kurt on 2017-03-16.
 */
// src/components/Contact/ContactListRow.js

// import libraries
import m from '../../utils/m-mock'
import R from 'ramda'
// import btn from 'polythene/button/button'
import * as X from '../../utils/xioup.main.utils'

// import model
import M from 'Contact/ContactModel'

module.exports = vn =>
    <div class={ `${ M.table }-list-item` } key={ vn.id } onclick={ console.log }>
      <span>{ M.listRowLabel( vn ) }</span>
      &nbsp;&nbsp;
      <a class="button" href={ X.showRowHref( M.table, vn ) } oncreate={ m.route.link }>View</a>
      &nbsp;&nbsp;
      <a class="button" href={ X.editRowHref( M.table, vn ) } oncreate={ m.route.link }>Edit</a>
      &nbsp;&nbsp;
      <button class="button">Remove</button>
      &nbsp;&nbsp;
      <btn label="IT FINALLY WORKS!" raised={ true }/>
    </div>

