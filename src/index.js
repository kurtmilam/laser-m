/**
 * Created by Kurt on 2017-03-09.
 */
// src/index.js

// import libraries
import m from 'mithril'
import M from 'xioup.main.utils'
import prop from 'ramda/src/prop'

// import views
import Layout from 'Layout/Layout'

// import components
import Home from 'Home/Home'
import UserList from 'User/UserList'
import UserShow from 'User/UserShow'
import UserEdit from 'User/UserEdit'

// get rid of the hashBang in front of routes
// see: http://mithril.js.org/route.html#how-it-works
// m.route.prefix( '' )

m.route( document.body
       , ''
       , { '': { render: vn => m( Layout, m( Home, M.getAttrs( vn ) ) ) }
         , '/users': { render: vn => m( Layout, m( UserList, M.getAttrs( vn ) ) ) }
         , '/users/:id': { render: vn => m( Layout, m( UserShow, M.getAttrs( vn ) ) ) }
         , '/users/:id/edit': { render: vn => m( Layout, m( UserEdit, M.getAttrs( vn ) ) ) }
         }
       )
