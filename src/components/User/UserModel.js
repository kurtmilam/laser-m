/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/UserModel.js

// import libraries
import { request } from 'mithril'
import Stream from 'mithril/stream'
import * as L from 'partial.lenses'
import M from 'xioup.main.utils'
import compose from 'ramda/src/compose'
import trim from 'ramda/src/trim'

const apiEndpoint = `${ M.apiUrlRoot }/users`
const apiItem = `${ apiEndpoint }/:id`

// streams
const itemList = Stream( [] )
const item = Stream( {} )

// api methods
const loadItemList = () =>
  request( { method: "GET"
             , url: apiEndpoint
             , withCredentials: true
             }
           )
  .then( compose( itemList, M.getData ) )

const loadItem = id =>
  request( { method: "GET"
             , url: apiItem
             , data: { id }
             , withCredentials: true
             }
           )
  .then( compose( item ) )

const emptyItem = () => item( {} )

const saveItem = a =>
  request( { method: "PUT"
             , url: apiItem
             , data: a
             , withCredentials: true
             }
           )
  .then( item )

const validateAndSaveItem = () =>
  compose( saveItem
         , item
         , modifyFirstName( trim )
         , modifyLastName( trim )
         )( item() )

// getters and setters
const getFirstName = L.get( 'firstName' )
const modifyFirstName = L.modify( 'firstName' )
const removeFirstName = L.remove( 'firstName' )
const setFirstName = L.set( 'firstName' )

const getLastName = L.get( 'lastName' )
const modifyLastName = L.modify( 'lastName' )
const removeLastName = L.remove( 'lastName' )
const setLastName = L.set( 'lastName' )

//computed properties
const firstAndLastName = a => `${ getFirstName( a ) } ${ getLastName( a ) }`

module.exports =
  { itemList
  , item
  , loadItemList
  , loadItem
  , emptyItem
  , saveItem
  , getFirstName
  , modifyFirstName
  , removeFirstName
  , setFirstName
  , getLastName
  , modifyLastName
  , removeLastName
  , setLastName
  , firstAndLastName
  , validateAndSaveItem
  }
