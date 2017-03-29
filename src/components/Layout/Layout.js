/**
 * Created by Kurt on 2017-03-09.
 */

// import libraries
import m from '../../utils/m-mock'
import * as L from 'partial.lenses'

const Layout =
  { view: vn =>
    <layout class="layout">
      <nav class="menu">
        <a href="/" oncreate={ m.route.link }>
          Home
        </a>
        <a href="/users" oncreate={ m.route.link }>
          Users
        </a>
        <a href="/contacts" oncreate={ m.route.link }>
          Contacts
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

module.exports = Layout
