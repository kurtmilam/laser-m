/**
 * Created by Kurt on 2017-04-10.
 */

// import libraries
import m from './m-mock'
import * as R__ from './xioup.ramda'
import * as X from './xioup.main.utils'
import R from 'ramda'
import * as L from 'partial.lenses'
import * as laser from './xioup.laser'

// api model functions
const dataContainerSpec =
  { id: L.get( 'id' )
  , children: []
  , computed: {}
  , data: X.freeze
  , rowType: R__.always( 'e.g. users, people' )
  , ui: {}
  }
const initDataContainer = R__.compose( X.freeze )( R.applySpec )( dataContainerSpec )
const putDataInContainer = R__.compose( R__.map( initDataContainer ) )( L.get( [ 'data' ] ) )
const freezeDataContainer = R__.compose( X.freeze )( putDataInContainer )

// TODO: Make it possible to send in a preprocessor / reducer (for instance, for sorting)
const loadTableFromApi = apiUrl => _ =>
  m.request( { method: "GET"
             , url: apiUrl
             , withCredentials: true
             }
          )
  .then( freezeDataContainer )


// TODO: Make it possible to send in a preprocessor / reducer (for instance, for normalization)
const loadRowFromApi = apiUrl => $ => id =>
  m.request( { method: "GET"
             , url: apiUrl
             , data: { id }
             , withCredentials: true
             }
           )
  .then( R__.compose( $, initDataContainer ) )

// TODO: Make it possible to send in a preprocessor / reducer (for instance, for validation)
const saveRowToApi = apiUrl => $ => dataL =>
  m.request( { method: "PUT"
             , url: apiUrl
             , data: laser.view( dataL )( $ )
             , withCredentials: true
             }
           )
  .then( laser.setOn$( $ )( dataL ) )

const saveRowToApi_ = apiUrl => dataL => $ =>
  saveRowToApi( apiUrl )( $ )( dataL )

const D =
  { loadTableFromApi
  , loadRowFromApi
  , saveRowToApi
  , saveRowToApi_
  }

module.exports = D
