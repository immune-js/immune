import
  { Task
  , maybe
  , andThen
  } from "../"

import
  { createLocation
  } from "../effects/location"

import EJSON    from "meteor-ejson"
import traverse from "./traverse"
import fetch    from "isomorphic-fetch"

global.fetch = fetch

export default (routes, { template = "", tags }) => {
  const render = ({ ctx, route, lang = "en", dir = "ltr" }) => {
    const currentRoute = createLocation(ctx.path, ctx.search, ctx.params, ctx.hash)
    const page         = routes.pages[route]
    
    const layoutProps  = { context: maybe(ctx), page: { ...page, props: { route: currentRoute, ...page.props } }, route: currentRoute }
    const pageProps    = { context: maybe(ctx), route: currentRoute, ...page.props }
    
    const Component = (page.layout !== false && routes.layout) 
      ? (console.log("got app"), routes.layout("application", { ...layoutProps, ...route.props }))
      : (console.log("no app"), routes.pages[route].component(route, { ...pageProps, ...route.props }))
    
    return Task.toPromise(andThen(traverse(Component, ctx), ([state, html]) => Task.of(
      template
        .replace(tags.lang  , lang)
        .replace(tags.dir   , dir)
        .replace(tags.title , "<title>" + routes.pages[route].title + "</title>")
        .replace(tags.state , "<script type='text/javascript'>window.APPLICATION_STATE = '" + EJSON.stringify(state) +  "'</script>")
        .replace(tags.view  , html)
    )))
  }
  
  return { render }
}
