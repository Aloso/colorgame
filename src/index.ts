// Import the polyfills you need! Most are in 'core-js/features/'
// Following polyfills are for promises, generators and async-await:
import 'core-js/features/promise'
import 'regenerator-runtime/runtime'

import './index.sass'

import { start } from './app/app'
import { byId } from './app/dom/dom-helper'

if (module.hot) {
  module.hot.accept()
  module.hot.addDisposeHandler(() => {
    byId('overlays', HTMLElement).innerHTML = ''
  })
}

start()
