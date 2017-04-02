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
const apiItemListUrl = `${ X.apiUrlRoot }/${ itemName }`
const apiItemUrl = `${ apiItemListUrl }/:id`

// state setup
const initialItemState =
  { id: itemName
  , current: { model: {}, ui: {}, comp: {} }
  , data: []
  , ui: { filter: { by: '' }, sort: { by: 'id' } }
  , comp: {}
  }

const itemState = state( [ itemName ], initialItemState )

// The following also works:
// const itemState = flyd.stream( initialItemState )

const item = X.lensedStreamAlt( 'current', itemState, {} )
const itemUi = X.lensedStreamAlt( 'current.ui', itemState, {} )

const itemList = X.lensedStreamAlt( 'data', itemState, [] )
const itemListUi = X.lensedStreamAlt( 'ui', itemState, {} )


// model state functions
const modifyItemList = X.modifyStreamProp( itemList )

const setItemPropToValueAttr = X.setStreamPropToValueAttr( item )
const getItemProp = X.getStreamProp( item )
const modifyItem = X.modifyStreamProp( item )

// ui state functions
const setItemUiPropToValueAttr = X.setStreamPropToValueAttr( itemUi )
const getItemUiProp = X.getStreamProp( itemUi )

const setItemListUiPropToValueAttr = X.setStreamPropToValueAttr( itemListUi )
const getItemListUiProp = X.getStreamProp( itemListUi )
const modifyItemListUi = X.modifyStreamProp( itemListUi )

//computed properties
const firstAndLastName = model =>
  `${ L.get( [ 'data', 'id' ], model ) }. ${ L.get( [ 'data', 'firstName' ], model ) } ${ L.get( [ 'data', 'lastName' ], model ) }`
const listItemLabel = firstAndLastName

// api methods
// TODO: Try to merge the following two functions into one
const loadItemListFromApi =
  R.composeP( itemList
            , X.loadItemListFromApi( apiItemListUrl )
            )

const loadItemList =
  R.when( R.equals( [] )
        , loadItemListFromApi
        )

const loadItem = X.loadItemFromApi( apiItemUrl, item )

const saveItem = X.saveItemToApi( apiItemUrl, item )

const validateAndSaveItem = _ =>
  R.compose( saveItem
           , R.tap( item )
           , L.modify( [ 'data', 'firstName' ], R.trim )
           , L.modify( [ 'data', 'lastName' ], R.trim )
           )( item() )

module.exports =
  { itemName
  , itemState
  , item
  , itemUi
  , itemList
  , itemListUi
  , loadItemList
  , modifyItemList
  , modifyItemListUi
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
