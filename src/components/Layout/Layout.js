/**
 * Created by Kurt on 2017-03-09.
 */

// import libraries
import m from 'mithril'
import M from  'xioup.main.utils'

const Layout =
  { view: vn =>
      m( 'main.layout'
       , [ m( 'nav.menu'
            , [ m( `a[href="/"]`, { oncreate: M.routeLink }, 'Home' )
              , m( `a[href="/users"]`, { oncreate: M.routeLink }, 'Users' )
              ]
            )
         , m( 'section', M.getChildren( vn ) )
         , m( 'div.footer', 'Footer' )
         ]
       )
  }

module.exports = Layout
