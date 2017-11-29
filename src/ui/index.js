import AppState            from "./app-state"
import renderer            from "./renderer"
import parseRoute          from "./parse-route"
import History             from "../effects/history"
import hyperappTransitions from "hyperapp-transitions"

import
  { Maybe
  , get_
  , fold
  } from "../"

export default (component, target) => {
  const render   = renderer(target)
  const location = History.toLocation(document.location)
  const instance = component("application", { location })
  
  AppState.subscribe(state => render(state, instance))
  
  // Trigger initial render
  AppState.update(state => state)
}

export const preventDefault = (msg, ...args) =>
  e => (e.preventDefault(), msg(...args))

export const targetValue = (msg, ...args) =>
  e => (msg(e.target.value, ...args))

export { default as h         } from "./h"
export            *             from "./component"

export const transitions = hyperappTransitions