/**
 * Created by Kurt on 2017-03-09.
 */

// import libraries
import m from 'mithril'
import * as L from 'partial.lenses'

const Layout =
  { view: vn =>
      m( 'main.layout'
       , [ m( 'nav.menu'
            , [ m( `a[href="/"]`, { oncreate: m.route.link }, 'Home' )
              , m( `a[href="/users"]`, { oncreate: m.route.link }, 'Users' )
              ]
            )
         , m( 'section', L.get( 'children', vn ) )
         , m( 'div.footer', 'Footer' )
         ]
       )
  }

module.exports = Layout
