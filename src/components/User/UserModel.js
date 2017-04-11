/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/UserModel.js

// import libraries
import * as R from 'xioup.ramda'
import * as L from 'partial.lenses'
import * as X from '../../utils/xioup.main.utils'
import * as laser from '../../utils/xioup.laser'
import * as D from '../../utils/xioup.data'

// import stateContainer
import stateContainer from 'App/AppModel'

// const testAtom = laser.lensedAtom( [ 'test', 'delete', 'me' ], stateContainer(), [] )
// window.testAtom = testAtom

// config
const entityName = 'users'

const listRowLabel = record =>
  L.get( [ 'data', 'id' ], record )
  + '. '
  + L.get( [ 'data', 'firstName' ], record )
  + ' '
  + L.get( [ 'data', 'lastName' ], record )

const valAndSave = cb => dataL =>
  R.compose( cb( dataL ) )
           ( R.pipe( laser.over$( [ dataL, 'firstName' ] )
                                ( R.pipe( R.trim, X.firstToUpper ) )
                   , laser.over$( [ dataL, 'lastName' ] )
                                ( R.pipe( R.trim, X.firstToUpper ) )
                   , laser.over$( [ dataL, 'nickname', L.optional ] )
                                ( R.pipe( R.trim, X.firstToUpper ) )
                   , laser.over$( [ dataL, 'age', L.optional ] )
                                ( Number )
                   )
           )

const makeCrud = ( entityName, listRowLabel, validateAndSaveRow ) => {
  // helpers
  const apiTableUrl = `${ X.apiUrlRoot }/${ entityName }`
  const apiRowUrl = `${ apiTableUrl }/:id`

  // stateContainer setup
  const containerType = 'table'
  const initTable =
    { id: containerType + ':' + entityName
    , rows: []
    , type: containerType
    , ui: { filter: { by: '' }, sort: { by: [ 'id' ] } }
    }
  const table$ = stateContainer( [ entityName ], initTable )
  // The following also works:
  // const table$ = flyd.stream( initTable )
  
  const state = stateContainer()
  window.state = state

  // lenses
  const rowsL = [ entityName, 'rows' ]
  // rowsA = laser.lensedAtom( rowsL, state, [] )
  const rowsUIL = [ entityName, 'ui' ]

  // api methods
  // TODO: Try to merge the following two functions into one?
  const loadTableFromApi =
    R.composeP( laser.setOn$( state )( rowsL )
              , D.loadTableFromApi( apiTableUrl )
              )

  // reloads the table if called with []
  // useful for conditionally loading from the Api when the atom is empty
  const loadTable = R.when( R.equals( [] ) )( loadTableFromApi )

  // const getById = id =>
  //   laser.lensedAtom( rowByIdL( id ), state )

  const saveRow = D.saveRowToApi_( apiRowUrl )

  return { entityName
         , state
         , containerType
         // , table$
         , rowsL
         , rowsUIL
         , loadTableFromApi
         , loadTable
         // , getById
         , validateAndSaveRow: validateAndSaveRow( saveRow )
         , listRowLabel
         }
}

module.exports = makeCrud( 'users', listRowLabel, valAndSave )
