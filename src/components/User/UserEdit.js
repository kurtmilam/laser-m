/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/ContactEdit.js

// import libraries
import m from '../../utils/m-mock'
import R__ from 'xioup.ramda'
import R from 'ramda'
import * as L from 'partial.lenses'
import * as X from '../../utils/xioup.main.utils'

// import model
import M from 'User/UserModel'

module.exports =
  { oninit: vn =>
      { // console.log( vn )
        const id = Number( vn.attrs.id )
        const state = M.state
        const rowL = M.getRowL( id )
        const dataL = X.appendTo( rowL )( 'data' )
        // const atom = X.lensedAtom( M.getRowL( id ), M.state )
        const firstNameL = X.appendTo( dataL )( 'firstName' )
        const lastNameL = X.appendTo( dataL )( 'lastName' )
        const uiL = X.appendTo( rowL )( 'ui' )
        const formL = X.appendTo( uiL )( 'form' )
        const initialL = X.appendTo( formL )( 'initial' )
        const bindValue = X.bindSOn( 'value' )
        const bindValueChange = bindValue( 'onchange' )
                                         ( state )
        // console.log( vn.atom() )
        // typeof vn.atom() === 'undefined' if no match is found
        // L.set(  )
        vn.state = { id
                   , state
                   // , atom
                   , rowL
                   , dataL
                   , initialL
                   , bindValueChange
                   , firstNameL
                   , bindFirstName2:  _ => bindValueChange( firstNameL )
                   , lastNameL
                   , bindLastName2:   _ => bindValueChange( lastNameL )
                   }
        // TODO: Add reusable copy function
        const setInitial =
          X.set$( initialL )
                ( X.view( dataL )
                        ( state )
                )
        setInitial( state )
        // TODO: Add reusable compare function
        vn.state.formIsDirty =
          R.converge( X.notEquals
                    , [ X.view( initialL )
                      , R__.compose( L.get( dataL ) )
                                 ( R.call )
                      ]
                    )

        vn.state.cleanFormOnSave = s =>
          X.set$( initialL )
                ( X.view( dataL )( s ) )
                ( s )
        console.log( 'Last Name Lens', lastNameL )
        window.vn = vn
        // window.onbeforeunload = e => 'are you sure?'
      }
  , view: vn =>
    <div>
      <label class="label">
        First Name
        <input class="input" placeholder="First Name" type="text"
               { ...vn.state.bindFirstName2() }/>
      </label>
      <label class="label">
        Last Name
        <input class="input" type="text" placeholder="Last Name"
               { ...vn.state.bindValueChange( vn.state.lastNameL ) }/>
      </label>
      <button class="button"
              onclick={ _ => R.composeP( vn.state.cleanFormOnSave
                                       , M.validateAndSaveRow( vn.state.dataL )
                                       )
                                       ( vn.state.state )
                      }
      >Save</button>
      &nbsp;
      <a class="button"
         href={ `/${ M.entityName }/` }
         oncreate={ m.route.link }
      >Cancel</a>
    </div>
  }
