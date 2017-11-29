import 
  { Maybe
  , caseOf
  , foldl
  , map
  , is
  , IMMUNE_ARGS_SYM
  } from "../.."

import toRegex from "path-to-regexp"

const matchURI = (path, uri, types) => {
  const keys    = []
  const pattern = toRegex(path, keys) // TODO: cache paths
  const match   = pattern.exec(uri)
  
  if (!match) return Maybe.None()
  
  const params      = [];
  let   typesMatch  = true
  
  for (let i = 1; i < match.length; i++) {
    let param = match[i]
    
    try { param = JSON.parse(decodeURI(param)) } catch (ex) {}
    
    if (param && types[i - 1] === Object ? param.constructor === Object : is(param, types[i - 1]))
      params.push(param)
    else {
      typesMatch = false
      break;
    }
  }
  
  return typesMatch ? Maybe.Some(params) : Maybe.None()
}

export default (location, routeMap) =>
  foldl(routeMap, Maybe.None(), (acc, [path, route]) =>
    caseOf(acc,
      { Some: Maybe.Some
      , None: () => 
          map(matchURI(path, location.path, route[IMMUNE_ARGS_SYM]), params => route(...params))
      }
    )
  )