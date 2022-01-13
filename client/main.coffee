import {render, hydrate} from 'solid-js/web'
import {onPageLoad} from 'meteor/server-render'

import {App} from '/ui/main.coffee'

dispose = undefined
renderApp = ->
  ## Render or hydrate depending on whether SSR is enabled.
  if document.querySelector 'body > :not(script)'
    console.log 'Hydrating from SSR'
    dispose = hydrate (-> <App/>), document.body
  else
    console.log 'Rendering from scratch'
    dispose = render (-> <App/>), document.body
onPageLoad renderApp

## Enable HMR: If this file changes, rerender instead of reloading.
module.hot?.dispose -> dispose?()
module.hot?.accept()
