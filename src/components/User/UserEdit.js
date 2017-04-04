/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/ContactEdit.js

// import libraries
import m from '../../utils/m-mock'
import * as L from 'partial.lenses'
import * as X from '../../utils/xioup.main.utils'

// import model
import M from 'User/UserModel'

module.exports =
  { oninit: vn =>
      { console.log( vn )
        const id = Number( vn.attrs.id )
        const atom = M.getRowById( id )
        // typeof atom() === 'undefined' if no match is found
        const data = X.lensedAtom( [ 'data' ], atom, {} )
        // const testFreeze = atom()
        // testFreeze.id = 2
        // console.log( testFreeze, atom() )
        vn.state = { atom
                   , data
                   , initial: data()
                   }
        // window.vnstate = vn.state
      }
  // , onremove: M.item.end()
  , view: vn =>
    <div>
      <label class="label">
        First Name
        <input
          class="input"
          type="text"
          placeholder="First Name"
          onchange={ X.setToValueAttr( vn.state.data )( [ 'firstName' ] ) }
          value={ X.get( vn.state.data )( [ 'firstName' ] ) }
        />
      </label>
      <label class="label">
        Last Name
        <input
          class="input"
          type="text"
          placeholder="Last Name"
          onchange={ X.setToValueAttr( vn.state.data )( [ 'lastName' ] ) }
          value={ X.get( vn.state.data )( [ 'lastName' ] ) }
        />
      </label>
      <button class="button" onclick={ _ => M.validateAndSaveRow( vn.state.data ) }>Save</button>
      &nbsp;
      <a class="button" href={ `/${ M.entityName }/` }  oncreate={ m.route.link }>Cancel</a>
    </div>
  }
