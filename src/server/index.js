import
  { Task
  , Some
  , andThen
  , show
  } from "../"

import
  { createLocation
  } from "../effects/location"

import EJSON    from "meteor-ejson"
import traverse from "./traverse"
import fetch    from "isomorphic-fetch"

global.fetch = fetch

console.log("server required")

export default (App, { template = "", tags }) => {
  const render = ({ context, lang = "en", dir = "ltr" }) => {
    const location = createLocation(context.path, context.search, context.params, context.hash)
    const app      = App("application", { context: Some(context), location })
    
    return Task.toPromise(andThen(traverse(app, Some(context)), ([state, html]) => Task.of(
      template
        .replace(tags.lang  , lang)
        .replace(tags.dir   , dir)
        .replace(tags.state , "<script type='text/javascript'>window.APPLICATION_STATE = '" + EJSON.stringify(state) +  "'</script>")
        .replace(tags.view  , html)
    )))
  }
  
  return { render }
}
