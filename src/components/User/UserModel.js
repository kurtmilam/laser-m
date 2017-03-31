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
const itemName = 'users'

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

// model state functions
const modifyItemList = X.modifyStreamProp( itemList, [] )

const setItemPropToValueAttr = X.setStreamPropToValueAttr( item )
const getItemProp = X.getStreamProp( item )
const modifyItem = X.modifyStreamProp( item, [] )

const validateAndSaveItem = () =>
  R.compose( saveItem
           , R.tap( item )
           , L.modify( 'firstName', R.trim )
           , L.modify( 'lastName', R.trim )
           )( item() )

const validateAndSaveItemNew = () =>
modifyItem(
  R.compose( saveItem
           , L.modify( 'firstName', R.trim )
           , L.modify( 'lastName', R.trim )
           )
)

// ui state functions
const setItemUiPropToValueAttr = X.setStreamPropToValueAttr( itemUi )
const getItemUiProp = X.getStreamProp( itemUi )

const setItemListUiPropToValueAttr = X.setStreamPropToValueAttr( itemListUi )
const getItemListUiProp = X.getStreamProp( itemListUi )
const modifyItemListUi = X.modifyStreamProp( itemListUi, [] )

// initialize ui state
modifyItemListUi( R.compose( L.set( [ 'filter' ], '' ), L.set( [ 'sort' ], 'id' ) ) )

//computed properties
const firstAndLastName = model => `${ L.get( 'id', model ) }. ${ L.get( 'firstName', model ) } ${ L.get( 'lastName', model ) }`
const listItemLabel = firstAndLastName

module.exports =
  { itemName
  , item
  , itemList
  , loadItemList
  , modifyItemList
  , loadItem
  , setItemPropToValueAttr
  , getItemProp
  , setItemUiPropToValueAttr
  , getItemUiProp
  , setItemListUiPropToValueAttr
  , getItemListUiProp
  , validateAndSaveItem
  , firstAndLastName
  , listItemLabel
  }
