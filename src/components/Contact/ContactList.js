/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/Contact/ContactList.js

// import libraries
import m from '../../utils/m-mock'
import R from 'ramda'
// import btn from 'polythene/button/button'
import * as X from '../../utils/xioup.main.utils'

// import model
import M from 'Contact/ContactModel'

import ContactListItem from 'Contact/ContactListItem'

module.exports =
  { oninit: M.loadItemList
  , view: vn =>
      <div class={ `${ M.itemName }-list` }>
        <btn label="IT FINALLY WORKS!" raised={ true }/>
        { R.map( ContactListItem, M.itemList() ) }
      </div>
  }
