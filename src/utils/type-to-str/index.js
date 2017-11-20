import 
  { IShow
  } from "../../"

import
  { augments
  } from "../protocol"

import
  { IMMUNE_NAME_SYM
  } from "../../symbols"

/*
 * typeToStr(type: Any) => String
 *
 * Returns a human-readable string representation of a type
 *
 */

export const typeToStr = str => {
  if (str == null) 
    return 'Null'
  
  if (typeof(str) === 'string') 
    return `"${str}"`
  
  if (str.constructor === Object)
    return `{ ${Object.keys(str).map(key => `${key}: ${typeToStr(str[key])}`).join(', ')} }`
  
  if (Array.isArray(str))
    return `[ ${str.map(typeToStr).join(', ')} ]`
  
  if (str[IMMUNE_NAME_SYM]) 
    return `${str[IMMUNE_NAME_SYM]}`
  
  if ((str || '').toString().match(/function /))
    return str.toString().replace(/function /, '').replace(/\n/g, ' ').replace(/\(.*/, '')
  
  return IShow.show(str)
}