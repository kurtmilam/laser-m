/**
 * Created by Kurt on 2017-03-09.
 */

// import libraries
import m from 'mithril'
import M from 'main.utils'

module.exports = {
  view: vn =>
    <main class="layout">
      <nav class="menu">
        <a class="navbar" href="/" oncreate={ M.routeLink }>Home</a>
        &nbsp;&nbsp;
        <a class="navbar" href="/users" oncreate={ M.routeLink }>Users</a>
      </nav>
      <section>{ M.getChildren( vn ) }</section>
      <div>Footer</div>
    </main>
}
