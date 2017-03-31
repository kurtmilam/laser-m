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
const itemName = 'contacts'

// helpers
const apiItemList = `${ X.apiUrlRoot }/${ itemName }`
const apiItem = `${ apiItemList }/:id`

// state setup
const itemModelRootOptic = R.append( 'model', [ itemName ] )
const item = state( R.append( 'current', itemModelRootOptic ), {} )
const itemList = state( R.append( 'list', itemModelRootOptic ), [] )

const itemUIRootOptic = R.append( 'ui', [ itemName ] )
const itemUi = state( R.append( 'current', itemUIRootOptic ), {} )
const itemListUi = state( R.append( 'list', itemUIRootOptic ), {} )

// api methods
const loadItemList = X.loadItemListFromApi( apiItemList, itemList )

const loadItem = X.loadItemFromApi( apiItem, item )

const saveItem = X.saveItemToApi( apiItem, item )

// state functions
const setItemPropToValueAttr = X.setStreamPropToValueAttr( item )
const getItemProp = X.getStreamProp( item )

const validateAndSaveItem = () =>
  R.compose( saveItem
           , R.tap( item )
           , L.modify( 'firstName', R.trim )
           , L.modify( 'lastName', R.trim )
           )( item() )

//computed properties
const firstAndLastName = model => `${ L.get( 'firstName', model ) } ${ L.get( 'lastName', model ) }`
const listItemLabel = firstAndLastName

module.exports =
  { itemName
  , item
  , itemList
  , loadItemList
  , loadItem
  , setItemPropToValueAttr
  , getItemProp
  , validateAndSaveItem
  , firstAndLastName
  , listItemLabel
  }
