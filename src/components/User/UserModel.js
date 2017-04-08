/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/UserModel.js

// import libraries
import m from '../../utils/m-mock'
import R from 'ramda'
import * as L from 'partial.lenses'
import * as X from '../../utils/xioup.main.utils'
import flyd from 'flyd'

// import stateContainer
import stateContainer from 'App/AppModel'

// config
const entityName = 'users'

const state = stateContainer()

// helpers
const apiTableUrl = `${ X.apiUrlRoot }/${ entityName }`
const apiRowUrl = `${ apiTableUrl }/:id`

// stateContainer setup
// probably add it to the container
const containerType = 'table'
const initTable =
  { id: containerType + ':' + entityName
  , computed: {}
  , rows: []
  , type: containerType
  , ui: { filter: { by: '' }, sort: { by: [ 'id' ] } }
  }

const table$ = stateContainer( [ entityName ], initTable )

// The following also works:
// const table$ = flyd.stream( initTable )

const rowsL = [ entityName, 'rows' ]
const rowsA   = X.lensedAtom( [ entityName, 'rows' ], state, [] )
const rowsUIA = X.lensedAtom( [ entityName, 'ui' ], state, {} )
// const testAtom = X.lensedAtom( [ 'test', 'delete', 'me' ], stateContainer(), [] )
// window.testAtom = testAtom
window.state = state

const dataL = [ 'data' ]
const dataPropL = X.appendTo( dataL )

//computed properties
const listRowLabel = record =>
  L.get( dataPropL( 'id' ), record )
  + '. '
  + L.get( dataPropL( 'firstName' ), record )
  + ' '
  + L.get( dataPropL( 'lastName' ), record )

// api methods
// TODO: Try to merge the following two functions into one
const loadTableFromApi =
  R.composeP( rowsA
            , X.map( X.tap( X.freeze ) )
            , X.loadTableFromApi( apiTableUrl )
            )

// reloads the table if called with []
// useful for conditionally loading from the Api when the atom is empty
const loadTable = X.when( R.equals( [] ) )( loadTableFromApi )

const rowByIdL = id =>
  L.compose( rowsL
           , L.find( R.whereEq( { id } ) )
           )
const getById = id =>
  X.lensedAtom( rowByIdL( id ), state )

const saveRow = X.saveRowToApi( apiRowUrl )

const validateAndSaveRow = row =>
  R.compose( saveRow( row )
           , L.get( dataL )
           , X.tap( row )
           , L.modify( [ 'data', 'firstName' ], R.trim )
           , L.modify( [ 'data', 'lastName' ], R.trim )
           )( row() )

module.exports =
  { entityName
  , state
  , table$
  , rowsA
  , rowsUIA
  , loadTableFromApi
  , loadTable
  , rowByIdL
  , getById
  , validateAndSaveRow
  , listRowLabel
  }
