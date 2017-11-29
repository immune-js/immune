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

const _createHistory = (config = {}) =>
  history = history || createHistory(config || {})

export const listen = (msg, config) => {
  _createHistory(config)
  
  let unlisten
  
  return map(dropRepeats(startWith(Stream.create(
    { start : listener =>
        unlisten = history.listen(loc => listener.next(loc))
      
    , stop  : () =>
        unlisten()
    }
  ), history.location), compareUrls), loc => msg(toLocation(loc)))
}

export const location =
  Task((_, succeed) => { 
    _createHistory()
    succeed(toLocation(history.location)) 
  })

export const push = (path, context = {}) =>
  Task((_, succeed) => {
    _createHistory()
    stringifyLocation(history.location) !== path && history.push(path, context)
    succeed()
  })

export const replace = (path, context = {}) =>
  Task((_, succeed) => {
    _createHistory()
    history.replace(path, context)
    succeed()
  })


export const forward = () =>
  Task((_, succeed) => {
    _createHistory()
    history.forward()
    succeed()
  })

export const back = () =>
  Task((_, succeed) => {
    _createHistory()
    history.back()
    succeed()
  })

//******************************************************************************
// Utils
//******************************************************************************

export const toLocation = ({ pathname, search, hash }) => {
  return createLocation(pathname, search, {}, hash)
}

const stringifyLocation = loc =>
  `${loc.pathname}${loc.search}${loc.hash}`

const compareUrls = (prev, next) => 
  stringifyLocation(prev) === stringifyLocation(next) && equals(prev.state || {}, next.state || {})
  
export default { listen, location, push, replace, forward, back, toLocation }