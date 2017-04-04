/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/Contact/ContactList.js

// import libraries
import m from '../../utils/m-mock'
import R from 'ramda'
import * as X from '../../utils/xioup.main.utils'

// import model
import M from 'Contact/ContactModel'

import ContactListRow from 'Contact/ContactListItem'

module.exports =
  { oninit: M.loadTable
  , view: vn =>
      <div class={ `${ M.table }-list` }>
        { R.map( ContactListRow, M.rows$() ) }
      </div>
  }
