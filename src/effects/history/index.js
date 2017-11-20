import createHistory from "history/createBrowserHistory"
import 
  { createLocation
  } from "../location"

import 
  { Task
  , Stream
  , startWith
  , map
  , dropRepeats
  , slice
  , split
  , conj
  , foldl
  , equals
  } from "../.."

let history

export const listen = (msg, config) => {
  history = history || createHistory(config || {})
  
  let unlisten
  
  return map(dropRepeats(startWith(Stream.create(
    { start : listener =>
        unlisten = history.listen(loc => listener.next(loc))
      
    , stop  : () =>
        unlisten()
    }
  ), history.location), compareUrls), loc => msg(toLocation(loc)))
}

export const push = (path, context = {}) =>
  Task((_, succeed) => 
    (stringifyLocation(history.location) !== path && history.push(path, context), succeed())
  )

export const replace = (path, context = {}) =>
  Task((_, succeed) => 
    (history.replace(path, context), succeed())
  )


export const forward = () =>
  Task((_, succeed) => 
    (history.forward(), succeed())
  )

export const back = () =>
  Task((_, succeed) => 
    (history.back(), succeed())
  )

//******************************************************************************
// Utils
//******************************************************************************

export const toLocation = ({ pathname, search, params = {}, hash }) => {
  return createLocation(pathname, search, params, hash)
}

const stringifyLocation = loc =>
  `${loc.pathname}${loc.search}${loc.hash}`

const compareUrls = (prev, next) => 
  stringifyLocation(prev) === stringifyLocation(next) && equals(prev.state || {}, next.state || {})
  
export default { listen, push, replace, forward, back, toLocation }