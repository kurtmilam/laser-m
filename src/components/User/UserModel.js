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
  { current: { data: {}, ui: {}, comp: {} }
  , list: { data: []
          , ui: { filter: { by: '' }, sort: { by: 'id' } }
          , comp: {}
          }
  }

const itemState = state( [ itemName ], initialItemState )

const item = X.lensedStreamAlt( 'current.data', itemState, {} )
const itemUi = X.lensedStreamAlt( 'current.ui', itemState, {} )

const itemList = X.lensedStreamAlt( 'list.data', itemState, [] )
const itemListUi = X.lensedStreamAlt( 'list.ui', itemState, {} )


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
  `${ L.get( 'id', model ) }. ${ L.get( 'firstName', model ) } ${ L.get( 'lastName', model ) }`
const listItemLabel = firstAndLastName

// api methods
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
           , L.modify( 'firstName', R.trim )
           , L.modify( 'lastName', R.trim )
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
