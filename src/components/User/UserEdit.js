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

const localState = X.compose( M.getById )( Number )

module.exports =
  { oninit: vn =>
      { // console.log( vn )
        const id = Number( vn.attrs.id )
        const atom = localState( id )
        // console.log( atom() )
        // typeof atom() === 'undefined' if no match is found
        // L.set(  )
        vn.state = { id
                   , atom
                   , initial: atom().data
                   , bindSOn: X.bindSOn( 'value' )( 'onchange' )( atom )
                   }
        window.vnstate = vn.state
      }
  // , onremove: M.item.end()
  , view: vn =>
    <div>
      <label class="label">
        First Name
        <input class="input" placeholder="First Name" type="text"
               { ...vn.state.bindSOn( [ 'data', 'firstName' ] ) }/>
      </label>
      <label class="label">
        Last Name
        <input class="input" type="text" placeholder="Last Name"
               { ...vn.state.bindSOn( [ 'data', 'lastName' ] ) }/>
      </label>
      <button class="button"
              onclick={ _ => M.validateAndSaveRow( vn.state.atom ) }
      >Save</button>
      &nbsp;
      <a class="button"
         href={ `/${ M.entityName }/` }
         oncreate={ m.route.link }
      >Cancel</a>
    </div>
  }
