/**
 * Created by Kurt on 2017-03-09.
 */

// import libraries
import m from '../../utils/m-mock'
import * as L from 'partial.lenses'

module.exports =
  { view: vn =>
    <layout class="layout">
      <nav class="navbar">
        <a class="button" href="/" oncreate={ m.route.link }>
          Home
        </a>
        <a class="button" href="/users" oncreate={ m.route.link }>
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
