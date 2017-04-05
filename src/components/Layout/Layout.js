/**
 * Created by Kurt on 2017-03-09.
 */

// import libraries
import m from '../../utils/m-mock'
import * as L from 'partial.lenses'

module.exports =
  { view: vn =>
    <layout class="layout">
      <nav class="menu">
        <a href="/" oncreate={ m.route.link }>
          Home
        </a>
        <a href="/users" oncreate={ m.route.link }>
          Users
        </a>
      </nav>
      <section>
        { L.get( 'children', vn ) }
      </section>
      <footer class="footer">
        Footer
      </footer>
    </layout>
  }
