/**
 * Created by Kurt on 2017-03-24.
 */

const isBrowser = () => typeof window !== 'undefined'

const loadBrowserPolyfills = () => {
  // console.log('is node')
// Polyfill DOM env for mithril
  global.window = require("mithril/test-utils/browserMock.js")()
  global.document = window.document

// Require the lib AFTER THE POLYFILL IS UP
  const m = require("mithril")

// Make available globally for client scripts running on the server
  global.m = m

  return m
}

const m = isBrowser()
          ? require("mithril")
          : loadBrowserPolyfills()

// Export for normal server usage
module.exports = m
