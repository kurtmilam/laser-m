/**
 * Created by Kurt on 2017-03-10.
 */
// src/components/User/user.utils.js

// import libraries
import * as L from 'partial.lenses'
import M from 'main.utils'
import compose from 'ramda/src/compose'
import concat from 'ramda/src/concat'

// private lenses
const _firstNameLens = L.prop( 'firstName' )
const _lastNameLens = L.prop( 'lastName' )

// exported lenses
const getFirstName = L.get( _firstNameLens )
const modifyFirstName = L.modify( _firstNameLens )
const removeFirstName = L.remove( _firstNameLens )
const setFirstName = L.set( _firstNameLens )

const getLastName = L.get( _lastNameLens )
const modifyLastName = L.modify( _lastNameLens )
const removeLastName = L.remove( _lastNameLens )
const setLastName = L.set( _lastNameLens )

// exported functions
const firstAndLastName = a => `${ getFirstName( a ) } ${ getLastName( a ) }`
const editUserHref = compose( concat( '/users/' ), M.editHref )
const viewUserHref = compose( concat( '/users/' ), M.getId )

const C =
  { getFirstName
  , modifyFirstName
  , removeFirstName
  , setFirstName
  , getLastName
  , modifyLastName
  , removeLastName
  , setLastName
  , editUserHref
  , viewUserHref
  , firstAndLastName
  }

module.exports = C