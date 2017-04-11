/**
 * Created by Kurt on 2017-03-09.
 */
// src/index.js

// import libraries
import m from 'm-mock'
import * as R from 'xioup.ramda'
import * as L from 'partial.lenses'
import * as X from 'xioup.main.utils'

// import views
import Layout from 'Layout/Layout'

// import components
import App from 'App/App'
import Home from 'Home/Home'
import UserList from 'User/UserList'
import UserShow from 'User/UserShow'
import UserEdit from 'User/UserEdit'
// import ContactList from 'Contact/ContactList'
// import ContactShow from 'Contact/ContactShow'
// import ContactEdit from 'Contact/ContactEdit'

// get rid of the hashBang in front of routes
// see: http://mithril.js.org/route.html#how-it-works
// m.route.prefix( '' )

const typeEquals = ( type ) =>
  R.compose( R.equals( type ) )( R.type )

const composeComponents =
  R.curry( ( root, parent, main ) =>
             R.compose( R.compose( X.m2( root ) )( X.m2( parent ) ) )
                        ( R.compose( X.m2( main ) )( L.get( 'attrs' ) ) )
        )
const composeAppComponent = composeComponents( App )
const composeAppLayoutComponent = composeAppComponent( Layout )

m.route( document.body
       , ''
       , { '': { render: composeAppLayoutComponent( Home ) }
         , '/users': { render: composeAppLayoutComponent( UserList ) }
         , '/users/:id': { render: composeAppLayoutComponent( UserShow ) }
         , '/users/:id/edit': { render: composeAppLayoutComponent( UserEdit ) }
         }
      )
