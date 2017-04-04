/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/Contact/ContactModel.js

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
const apiTable = `${ X.apiUrlRoot }/${ entityName }`
const apiRow = `${ apiTable }/:id`

// state setup
const itemModelRootOptic = R.append( 'models', [ entityName ] )
const item = state( R.append( 'current', itemModelRootOptic ), {} )
const rows$ = state( R.append( 'list', itemModelRootOptic ), [] )

const itemUIRootOptic = R.append( 'ui', [ entityName ] )
const itemUi = state( R.append( 'current', itemUIRootOptic ), {} )
const rowsUi$ = state( R.append( 'list', itemUIRootOptic ), {} )

// api methods
const loadTable = X.loadTableFromApi( apiTable, rows$ )

const loadRow = X.loadRowFromApi( apiRow, item )

const saveRow = X.saveRowToApi( apiRow, item )

// state functions
const setRowPropToValueAttr = X.setToValueAttr( item )
const getRowProp = X.select( item )

const validateAndSaveRow = () =>
  R.compose( saveRow
           , R.tap( item )
           , L.modify( 'firstName', R.trim )
           , L.modify( 'lastName', R.trim )
          )( item() )

//computed properties
const firstAndLastName = model => `${ L.get( 'firstName', model ) } ${ L.get( 'lastName', model ) }`
const listRowLabel = firstAndLastName

module.exports =
  { entityName
  , item
  , rows$
  , loadTable
  , loadRow
  , setRowPropToValueAttr
  , getRowProp
  , validateAndSaveRow
  , firstAndLastName
  , listRowLabel
  }
