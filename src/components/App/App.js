/**
 * Created by Kurt on 2017-03-14.
 */
// src/components/Home/Home.js

// import libraries
import m from 'mithril'
import Stream from 'mithril/stream'
import * as L from 'partial.lenses'

const appState = Stream( {} )

const App =
  { data: appState
  , view: vn =>
    <app class="app">
      { L.get( 'children', vn ) }
    </app>
  }

module.exports = App