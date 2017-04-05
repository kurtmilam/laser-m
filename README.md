# stream-state
Functional state-management experiment using lenses and streams (targeted to mithril)

This is currently a super alpha, very dirty work in progress.

__Caveats__:
1. In its current state, the project can only be run after preprocessing with webpack and babel.
2. I'm new to webpack and babel, so the current bundle js file is a __HUGE 1.6 MB__ until I figure out how to make it smaller.

Here's a [working version](http://xioupmedia.com/mithril-dev/index.html). Force reload if you want to check for updates - that server is actually configured like a CDN, so resources have long expiry times.

# Notes
I haven't done much new client-side development in the past 5 or 6 years, so I'm catching up on recent tools and techniques (e.g. webpack, babel, modules. I have recently focused more on server-side nodejs work as well as maintaining reasonably complex production browser applications with 5+ year old codebases.

You'll see a number of assignments to `window.varName` in the code - I don't use those in the application. They're purely there to make it easier to hack the various variables from my browser console during development.

I'll try to improve the live hosting and file size ASAP.
