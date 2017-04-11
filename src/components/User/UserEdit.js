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
        const nicknameL = X.appendTo( dataL )( 'nickname' )
        const ageL = X.appendTo( dataL )( 'age' )
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
                   , nicknameL
                   , bindNickname2:   _ => bindValueChange( nicknameL )
                   , ageL
                   , bindAge2:        _ => bindValueChange( ageL )
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
          R.converge( X.notEq
                    , [ laser.view( initialL )
                      , R.compose( L.get( dataL ) )
                                 ( R.call )
                      ]
                    )

        vn.state.cleanFormOnSave = s =>
          laser.set$( initialL )
                ( laser.view( dataL )( s ) )
                ( s )
        console.log( 'Last Name Lens', lastNameL )
        window.vn = vn
        // window.onbeforeunload = e => 'are you sure?'
      }
  , view: vn =>
    <div class="form">
      <label class="label">
        First Name
        <input class="input" placeholder="First Name" type="text"
               { ...vn.state.bindFirstName2() }/>
      </label>
      <label class="label">
        Last Name
        <input class="input" type="text" placeholder="Last Name"
               { ...vn.state.bindLastName2() }/>
      </label>
      <label class="label">
        Nickname
        <input class="input" type="text" placeholder="Nickname"
               { ...vn.state.bindNickname2() }/>
      </label>
      <label class="label">
        Age
        <input class="input" type="text" placeholder="Age"
               { ...vn.state.bindAge2() }/>
      </label>
      <div class="navbar">
        <button class="button"
                onclick={ _ => R.composeP( vn.state.cleanFormOnSave
                                         , M.validateAndSaveRow( vn.state.dataL )
                                         )
                                         ( vn.state.state )
                        }
        >Save</button>
        <button class="button"
           href={ `/${ M.entityName }/` }
           oncreate={ m.route.link }
        >Cancel</button>
      </div>
    </div>
  }
