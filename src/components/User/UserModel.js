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

// import state
import state from 'App/AppModel'

// config
const entityName = 'users'

// helpers
const apiTableUrl = `${ X.apiUrlRoot }/${ entityName }`
const apiRowUrl = `${ apiTableUrl }/:id`

// state setup
// Todo: think about how to differentiate children of different types
// probably add it to the container
const containerType = 'table'
const initTable =
  { id: containerType + ':' + entityName
  , computed: {}
  , rows: []
  , type: containerType
  , ui: { filter: { by: '' }, sort: { by: [ 'id' ] } }
  }

const table$ = state( [ entityName ], initTable )

// The following also works:
// const table$ = flyd.stream( initTable )

const rows_A_   = X.lensedAtom( [ 'rows' ], table$, [] )
const rowsUI_A_ = X.lensedAtom( [ 'ui' ], table$, {} )
// const testStream$ = flyd.map( rowsUI_A_ )
// window.testStream$ = testStream$

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
  R.composeP( rows_A_
            , R.map( R.tap( X.freeze ) )
            , X.loadTableFromApi( apiTableUrl )
            )

// reloads the table if called with []
// useful for conditionally loading from the Api when the atom is empty
const loadTable = R.when( R.equals( [] ), loadTableFromApi )

const getById = id =>
  X.lensedAtom( L.find( R.whereEq( { id } ) ), rows_A_ )

const saveRow = X.saveRowToApi( apiRowUrl )

const validateAndSaveRow = row_A_ =>
  R.compose( saveRow( row_A_ )
           , L.get( dataL )
           , R.tap( row_A_ )
           , L.modify( [ 'data', 'firstName' ], R.trim )
           , L.modify( [ 'data', 'lastName' ], R.trim )
           )( row_A_() )

module.exports =
  { entityName
  , table$
  , rows_A_
  , rowsUI_A_
  , loadTableFromApi
  , loadTable
  , getById
  , validateAndSaveRow
  , listRowLabel
  }
