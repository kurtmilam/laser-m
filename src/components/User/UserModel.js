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
  , ui: { filter: { by: '' }, sort: { by: 'id' } }
  }

const table$ = state( [ entityName ], initTable )

// The following also works:
// const table$ = flyd.stream( initTable )

const rows$  = X.lensedAtom( [ 'rows' ], table$, [] )
const rowsUi$ = X.lensedAtom( [ 'ui' ], table$, {} )

// table state queries
const selectRows = X.select( rows$ )
const updateRows = X.update( rows$ )

const setTableUiPropToValueAttr = X.setToValueAttr( rowsUi$ )
const selectRowsUi = X.select( rowsUi$ )
const updateRowsUi = X.update( rowsUi$ )

const dataOptic = [ 'data' ]
const dataPropOptic = X.appendTo( dataOptic )
//const getRowById =

//computed properties
const firstAndLastName = model =>
  `${ L.get( dataPropOptic( 'id' ), model ) }. ${ L.get( dataPropOptic( 'firstName' ), model ) } ${ L.get( dataPropOptic( 'lastName' ), model ) }`
const listRowLabel = firstAndLastName

// api methods
// TODO: Try to merge the following two functions into one
const loadTableFromApi =
  R.composeP( rows$
            , R.map( R.tap( Object.freeze ) )
            , X.loadTableFromApi( apiTableUrl )
           )

const loadTable =
  R.when( R.equals( [] )
        , loadTableFromApi
       )

// const selectRowById = X.loadRowFromApi( apiRowUrl, item )
const selectRowById = id =>
  X.lensedAtom( L.compose( L.find( R.whereEq( { id } ) ) ), rows$ )

  // L.find( x => x.data.id === id )

const saveRow = X.saveRowToApi( apiRowUrl )

const validateAndSaveRow = item =>
  R.compose( saveRow( item )
           , R.tap( item )
           , L.modify( [ 'firstName' ], R.trim )
           , L.modify( [ 'lastName' ], R.trim )
          )( item() )

module.exports =
  { entityName
  , table$
  , rows$
  , rowsUi$
  , loadTable
  , selectRows
  , updateRows
  , updateRowsUi
  , selectRowById
  , setTableUiPropToValueAttr
  , selectRowsUi
  , validateAndSaveRow
  , firstAndLastName
  , listRowLabel
  }
