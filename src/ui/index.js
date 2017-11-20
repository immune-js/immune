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

export default (routes, target) => {
  
  const render = renderer(target)
  
  document.addEventListener("click", e => {
    if (e.target.tagName === "A" && e.target.getAttribute("data-route") === "true") {
      e.preventDefault()
      History.push(e.target.pathname).fork(() => {}, () => {})
    }
  })
  
  History.listen(location => parseRoute(routes.pages, location))
    .addListener(
      { next  : route => AppState.assocIn(["activeRoute"], route)
      , error : err   => console.error(err)
      }
    )
    
  AppState.subscribe(state => {
    const activeRoute = fold(get_(state, "activeRoute"),
      route => ({ page: routes.pages[route.path], route }),
      error => ({ page: routes.pages[404], route: error })
    )
    
    const layoutProps = { context: Maybe.None(), page  : { ...activeRoute.page, props: { route: activeRoute.route, ...activeRoute.page.props } }, route: activeRoute.route }
    const pageProps   = { context: Maybe.None(), route : activeRoute.route, ...activeRoute.page.props }
    
    const Component = (activeRoute.layout !== false && routes.layout)
      ? routes.layout  ("application"          , { ...layoutProps , ...activeRoute.route.props })
      : page.component (activeRoute.route.path , { ...pageProps   , ...activeRoute.route.props })
    
    render(state, Component)
  })
}

export const preventDefault = (msg, ...args) =>
  e => (e.preventDefault(), msg(...args))

export const targetValue = (msg, ...args) =>
  e => (msg(e.target.value, ...args))

export { default as h         } from "./h"
export { default as component } from "./component"
export            *             from "./component"

export const transitions = hyperappTransitions