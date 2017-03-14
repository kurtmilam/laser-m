/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/UserModel.js

// import libraries
import m from 'mithril'
import Stream from 'mithril/stream'
import * as L from 'partial.lenses'
import * as X from 'xioup.main.utils'
import compose from 'ramda/src/compose'
import trim from 'ramda/src/trim'

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
  .then( compose( itemList, L.get( 'data' ) ) )

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
  compose( saveItem
         , item
         , L.modify( 'firstName', trim )
         , L.modify( 'lastName', trim )
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
