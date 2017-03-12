/**
 * Created by Kurt on 2017-03-09.
 */
// src/index.js

// import libraries
import m from 'mithril'
import prop from 'ramda/src/prop'

// import views
import Layout from 'Layout/Layout'

// import components
import Home from 'Home/Home'
import UserList from 'User/UserList'
import UserShow from 'User/UserShow'
import UserEdit from 'User/UserEdit'

const attributes = prop( 'attrs' )

// get rid of the hashBang in front of routes
// see: http://mithril.js.org/route.html#how-it-works
// m.route.prefix( '' )

m.route( document.body
       , ''
       , { '': { render: () => <Layout><Home /></Layout> }
         , '/users': { render: () => <Layout><UserList /></Layout> }
         , '/users/:id/edit': { render: vn => <Layout>{ m( UserEdit, attributes( vn ) ) }</Layout> }
         , '/users/:id': { render: vn => <Layout>{ m( UserShow, attributes( vn ) ) }</Layout> }
         }
       )
