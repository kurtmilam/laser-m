/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/ContactEdit.js

// import libraries
import m from '../../utils/m-mock'
import R from 'ramda'
import * as X from '../../utils/xioup.main.utils'

// import model
import M from 'User/UserModel'

const localState = X.compose( M.getById )( Number )

const notEquals = R.complement( R.equals )

module.exports =
  { oninit: vn =>
      { // console.log( vn )
        const id = Number( vn.attrs.id )
        const atom = localState( id )
        // console.log( atom() )
        // typeof atom() === 'undefined' if no match is found
        const firstName = X.lensedAtom( [ 'data', 'firstName' ], atom, '' )
        const lastName = X.lensedAtom( [ 'data', 'lastName' ], atom, '' )
        const initial = atom().data
        // L.set(  )
        vn.state = { id
                   , atom
                   , firstName
                   , bindSOn: X.bindSOn( 'value' )( 'onchange' )( atom )
                   , bindFirstName: X.bindSOn( 'value' )( 'onchange' )( firstName )
                   , bindLastName: X.bindSOn( 'value' )( 'onchange' )( lastName )
                   }
        X.set( [ 'ui', 'form', 'initial' ] )( atom().data )( atom )
        vn.state.formIsDirty = a =>
          notEquals( X.view( [ 'ui', 'form', 'initial' ] )( a )
                   , a().data
                   )

        vn.state.cleanFormOnSave = a =>
          X.set( [ 'ui', 'form', 'initial' ] )
               ( X.view( [ 'data' ] )( a ) )
               ( a )
        window.vnstate = vn.state
      }
  // , onremove: M.item.end()
  , view: vn =>
    <div>
      <label class="label">
        First Name
        <input class="input" placeholder="First Name" type="text"
               { ...vn.state.bindFirstName( [] ) }/>
      </label>
      <label class="label">
        Last Name
        <input class="input" type="text" placeholder="Last Name"
               { ...vn.state.bindSOn( [ 'data', 'lastName' ] ) }/>
      </label>
      <button class="button"
              onclick={ _ => X.compose( vn.state.cleanFormOnSave )
                                      ( X.tap( M.validateAndSaveRow ) )
                                      ( vn.state.atom )
                      }
      >Save</button>
      &nbsp;
      <a class="button"
         href={ `/${ M.entityName }/` }
         oncreate={ m.route.link }
      >Cancel</a>
    </div>
  }
