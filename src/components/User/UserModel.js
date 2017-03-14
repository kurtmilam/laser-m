/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/UserModel.js

// import libraries
import m from 'mithril'
import Stream from 'mithril/stream'
import R from 'ramda'
import * as L from 'partial.lenses'
import * as X from 'xioup.main.utils'

const apiEndpoint = `${ X.apiUrlRoot }/users`
const apiItem = `${ apiEndpoint }/:id`

// streams
const itemList = Stream( [] )
const item = Stream( {} )

// api methods
const loadItemList = () =>
  m.request( { method: "GET"
             , url: apiEndpoint
             , withCredentials: true
             }
           )
  .then( R.compose( itemList, L.get( 'data' ) ) )

const loadItem = id =>
  m.request( { method: "GET"
             , url: apiItem
             , data: { id }
             , withCredentials: true
             }
           )
  .then( item )

const emptyObjectStream = stream => () => stream( {} )

const saveItem = a =>
  m.request( { method: "PUT"
             , url: apiItem
             , data: a
             , withCredentials: true
             }
           )
  .then( item )

const validateAndSaveItem = () =>
  R.compose( saveItem
           , item
           , L.modify( 'firstName', R.trim )
           , L.modify( 'lastName', R.trim )
           )( item() )

//computed properties
const firstAndLastName = a => `${ L.get( 'firstName', a ) } ${ L.get( 'lastName', a ) }`

module.exports =
  { itemList
  , item
  , loadItemList
  , loadItem
  , emptyObjectStream
  , saveItem
  , firstAndLastName
  , validateAndSaveItem
  }
