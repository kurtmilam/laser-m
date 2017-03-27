/**
 * Created by Kurt on 2017-03-14.
 */
// src/components/Home/Home.js

// import libraries
import m from '../../utils/m-mock'
import * as L from 'partial.lenses'

const App =
  { view: vn =>
    <app class="app">
      { L.get( 'children', vn ) }
    </app>
  }

module.exports = App