/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/UserModel.js

// import libraries
import m from 'mithril'
import Stream from 'mithril/stream'
import R from 'ramda'
import * as L from 'partial.lenses'
import flyd from 'flyd'
import * as X from 'xioup.main.utils'

// import state
import state from 'App/AppModel'

const itemName = 'users'
const itemPath = `${ itemName }.current`
const item = X.lensedStream( itemPath, state, {} )
const itemListPath = `${ itemName }.list`
const itemList = X.lensedStream( itemListPath, state, [] )
// const test = flyd.merge( item, itemList )
// console.log( test() )

// helpers
const apiItemList = `${ X.apiUrlRoot }/users`
const apiItem = `${ apiItemList }/:id`

// api methods
const loadItemList = X.loadItemListFromApi( apiItemList, itemList )

const loadItem = X.loadItemFromApi( apiItem, item )

const saveItem = X.saveItemToApi( apiItem, item )

const validateAndSaveItem = () =>
  R.compose( saveItem
           , item
           , L.modify( 'firstName', R.trim )
           , L.modify( 'lastName', R.trim )
           )( item() )

//computed properties
const firstAndLastName = a => `${ L.get( 'firstName', a ) } ${ L.get( 'lastName', a ) }`

module.exports =
  { itemName
  , itemList
  , item
  , loadItemList
  , loadItem
  , saveItem
  , firstAndLastName
  , validateAndSaveItem
  }
