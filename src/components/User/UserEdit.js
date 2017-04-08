/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/ContactEdit.js

// import libraries
import m from '../../utils/m-mock'
import R from 'ramda'
import * as L from 'partial.lenses'
import * as X from '../../utils/xioup.main.utils'

// import model
import M from 'User/UserModel'

const getRowL = X.compose( M.rowByIdL )( Number )

module.exports =
  { oninit: vn =>
      { // console.log( vn )
        const id = Number( vn.attrs.id )
        const state = M.state
        const rowL = getRowL( id )
        const dataL = L.compose( rowL, 'data' )
        const atom = X.lensedAtom( getRowL( id ), M.state )
        const firstNameL = L.compose( dataL, 'firstName' )
        const lastNameL = L.compose( dataL, 'lastName' )
        const bindValue = X.bindSOn( 'value' )
        const bindValueChange = bindValue( 'onchange' )( state )
        // console.log( vn.atom() )
        // typeof vn.atom() === 'undefined' if no match is found
        // L.set(  )
        vn.state = { id
                   , state
                   , atom
                   , rowL
                   , dataL
                   , bindValueChange
                   , firstNameL
                   , bindFirstName: bindValueChange( firstNameL )
                   , lastNameL
                   , bindLastName:  bindValueChange( lastNameL )
                   }
        X.set( [ 'ui', 'form', 'initial' ] )( atom().data )( atom )
        vn.state.formIsDirty =
          R.converge( X.notEquals
                    , [ X.view( [ 'ui', 'form', 'initial' ] )
                      , X.compose( L.get( [ 'data' ] ) )( R.call )
                      ]
                    )

        vn.state.cleanFormOnSave = a =>
          X.set( [ 'ui', 'form', 'initial' ] )
               ( X.view( [ 'data' ] )( a ) )
               ( a )
        window.vn = vn
        // window.onbeforeunload = e => 'are you sure?'
      }
  , view: vn =>
    <div>
      <label class="label">
        First Name
        <input class="input" placeholder="First Name" type="text"
               { ...vn.state.bindValueChange( vn.state.firstNameL ) }/>
      </label>
      <label class="label">
        Last Name
        <input class="input" type="text" placeholder="Last Name"
               { ...vn.state.bindValueChange( vn.state.lastNameL ) }/>
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
