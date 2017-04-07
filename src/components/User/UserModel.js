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

const rowsA   = X.lensedAtom( [ 'rows' ], table$, [] )
const rowsUIA = X.lensedAtom( [ 'ui' ], table$, {} )
// const testStream$ = flyd.map( rowsUIA )
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
  R.composeP( rowsA
            , X.map( X.tap( X.freeze ) )
            , X.loadTableFromApi( apiTableUrl )
            )

// reloads the table if called with []
// useful for conditionally loading from the Api when the atom is empty
const loadTable = X.when( R.equals( [] ) )( loadTableFromApi )

const getById = id =>
  X.lensedAtom( L.find( R.whereEq( { id } ) ), rowsA )

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
  , table$
  , rowsA
  , rowsUIA
  , loadTableFromApi
  , loadTable
  , getById
  , validateAndSaveRow
  , listRowLabel
  }
