/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/ContactEdit.js

// import libraries
import m from '../../utils/m-mock'
import * as R from 'xioup.ramda'
import * as L from 'partial.lenses'
import * as X from '../../utils/xioup.main.utils'
import * as laser from '../../utils/xioup.laser'

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
        const bindValue = laser.bindSOn( 'value' )
        const bindValueChange = bindValue( 'onchange' )
                                         ( state )
        // console.log( atom() )
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
          laser.set$( initialL )
                ( laser.view( dataL )
                        ( state )
                )
        setInitial( state )
        // TODO: Add reusable compare function
        vn.state.formIsDirty =
          R.converge( X.notEquals
                    , [ laser.view( initialL )
                      , R.compose( L.get( dataL ) )
                                 ( R.call )
                      ]
                    )

        vn.state.cleanFormOnSave = s =>
          laser.set$( initialL )
                ( laser.view( dataL )( s ) )
                ( s )
        // console.log( 'Last Name Lens', lastNameL )
        console.log( R.toLower('SSS') )
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
