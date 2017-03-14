/**
 * Created by Kurt on 2017-03-09.
 */
// src/index.js

// import libraries
import m from 'mithril'
import R from 'ramda'
import * as L from 'partial.lenses'
import * as X from 'xioup.main.utils'

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

const makeRoute =
  R.curry( ( parent, main ) =>
             R.compose( X.m2( parent ), X.m2( main ), L.get( 'attrs' ) )
         )
const makeLayoutRoute = makeRoute( Layout )

m.route( document.body
       , ''
       , { '': { render: makeLayoutRoute( Home ) }
         , '/users': { render: makeLayoutRoute( UserList ) }
         , '/users/:id': { render: makeLayoutRoute( UserShow ) }
         , '/users/:id/edit': { render: makeLayoutRoute( UserEdit ) }
         }
       )
