# laser - m

Functional stateContainer-management experiment using lenses and streams (currently targeted to [mithril v1+](https://mithril.js.org/))

__Caveats__:
1. This is currently a super alpha, very dirty work in progress.
2. The project can only be run after preprocessing with webpack and babel.
3. I'm new to webpack and babel, and the bundle js file is currently a __HUGE 1.6 MB__.

Here's a [working version](http://xioupmedia.com/mithril-dev/index.html). Force reload if you want to check for updates - the server is configured like a CDN, so resources have long expiry times.

# Streams, Lenses and State
The basic idea here is to have a single, immutable container for stateContainer, using streams ([flyd](https://github.com/paldepind/flyd)), lenses ([partial.lenses](https://github.com/calmm-js/partial.lenses)) and stream-like things that I'm currently calling 'atoms'.

It's possible to push a new value or extract the current value from a flyd stream at any time:
```javascript
const stream = flyd.stream( { a: 1 } )
stream() // { a: 1 }
stream( { a: 2 } )
stream() // { a: 2 } 

```
The 'atoms' in this app work the same way, but have less overhead than a stream and don't emit events. For the most part, I use atoms and streams interchangeably.

The stateContainer-management logic hasn't been properly modularized, yet. For the most part, it's located in [/src/utils/xioup.main.utils.js](https://github.com/kurtmilam/stream-state/blob/master/src/utils/xioup.main.utils.js). 

# Notes
I haven't done much new client-side development in the past 5 or 6 years, so I'm catching up on recent tools and techniques (e.g. webpack, babel, modules. I have recently focused more on server-side nodejs work as well as maintaining reasonably complex production browser applications with 5+ year old codebases.

You'll see a number of assignments to `window.varName` in the code - I don't use those in the application. They're purely there to make it easier to hack the various variables from my browser console during development.

I'll try to improve the live hosting and file size ASAP.

```
l a s e r - m
e t t v e . i
n o r e a . t
s m e n c . h
e s a t t . r
s . m s i . i
. . s . v . l
. . . . e . .
```