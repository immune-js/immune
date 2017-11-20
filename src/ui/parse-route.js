import 
  { Maybe
  , Result
  , caseOf
  , foldl
  } from "../.."

import toRegex from "path-to-regexp"

const matchURI = (path, uri) => {
  const keys    = []
  const pattern = toRegex(path, keys) // TODO: cache paths
  const match   = pattern.exec(uri)
  
  if (!match) return Maybe.None()
  
  const params = {};
  
  for (let i = 1; i < match.length; i++) {
    params[keys[i - 1].name] =
      match[i] !== undefined ? match[i] : undefined;
  }
  
  return Maybe.Some(params)
}

export default (routes, location) =>
  foldl(routes, Result.Err({ path: "404", params: {}, uri: "404", query: {}, search: "" }), (acc, [path, route]) =>
    caseOf(acc,
      { Ok  : Result.Ok
      , Err : err => caseOf(matchURI(path, location.path), 
          { Some: params =>
              Result.Ok({ path, params, uri: location.path, query: location.query, hash: location.hash, search: location.search })
          , None: () =>
              Result.Err(err)
          }
        )
      }
    )
  )
  