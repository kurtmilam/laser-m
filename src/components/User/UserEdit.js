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

const getAtom = X.compose( M.getById )( Number )

module.exports =
  { oninit: vn =>
      { // console.log( vn )
        const id = Number( vn.attrs.id )
        const atom = getAtom( id )
        const firstName = X.lensedAtom( [ 'data', 'firstName' ]
                                      , atom
                                      , ''
                                      )
        const lastName = X.lensedAtom( [ 'data', 'lastName' ]
                                      , atom
                                      , ''
                                      )
        const bindSOnValue = X.bindSOn( 'value' )
        // console.log( vn.atom() )
        // typeof vn.atom() === 'undefined' if no match is found
        // L.set(  )
        vn.state = { id
                   , atom
                   , bindSOnAtom:   bindSOnValue( 'onchange' )
                                                ( atom )
                   , bindFirstName: bindSOnValue( 'onchange' )
                                                ( firstName )
                   , bindLastName:  bindSOnValue( 'onchange' )
                                                ( lastName )
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
        window.onbeforeunload = e => 'are you sure?'
      }
  , view: vn =>
    <div>
      <label class="label">
        First Name
        <input class="input" placeholder="First Name" type="text"
               { ...vn.state.bindSOnAtom( [ 'data', 'firstName' ] ) }/>
      </label>
      <label class="label">
        Last Name
        <input class="input" type="text" placeholder="Last Name"
               { ...vn.state.bindLastName( [] ) }/>
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
