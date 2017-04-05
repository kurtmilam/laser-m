/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/UserModel.js

// import libraries
import m from '../../utils/m-mock'
import R from 'ramda'
import * as L from 'partial.lenses'
import * as X from '../../utils/xioup.main.utils'

// import state
import state from 'App/AppModel'

// config
const entityName = 'contacts'

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

const dataO = [ 'data' ]
const dataPropO = X.appendTo( dataO )

//computed properties
const listRowLabel = model =>
  L.get( dataPropO( 'id' ), model )
  + '. '
  + L.get( dataPropO( 'firstName' ), model )
  + ' '
  + L.get( dataPropO( 'lastName' ), model )

// api methods
// TODO: Try to merge the following two functions into one
const loadTableFromApi =
  R.composeP( rows_A_
            , R.map( R.tap( Object.freeze ) )
            , X.loadTableFromApi( apiTableUrl )
            )

const loadTable = R.when( R.equals( [] ), loadTableFromApi )

const getById = id =>
  X.lensedAtom( L.find( R.whereEq( { id } ) ), rows_A_ )

const saveRow = X.saveRowToApi( apiRowUrl )

const validateAndSaveRow = row_A_ =>
  R.compose( saveRow( row_A_ )
           , R.tap( row_A_ )
           , L.modify( [ 'firstName' ], R.trim )
           , L.modify( [ 'lastName' ], R.trim )
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
