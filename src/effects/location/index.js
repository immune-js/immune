import 
  { Type
  } from "../.."

export const Location = Type("Location",
  { path   : String
  , query  : Object
  , params : Object
  , search : String
  , hash   : String
  }
)

export default Location

const parseQuery = (qs = "") =>
  qs.constructor === Object
    ? qs
    : qs.length ? qs.replace(/^\?/, "").split(/&/g).reduce((acc, kvp) => { const [k, v] = kvp.split("="); acc[k] = v; return acc }, {}) : {}

export const createLocation = (path, search, params, hash = "") =>
  Location(path, parseQuery(search), params, search, hash)

