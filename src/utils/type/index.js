import EJSON from "meteor-ejson"

import
  { show
  , is
  } from '../../index'

import
  { typeToStr
  } from '../type-to-str'

import
  { IMMUNE_NAME_SYM
  } from "../../symbols"

import
  { IAssociative
  } from "../../protocols/iassociative"

import
  { maybe
  } from "../../types/maybe"

// -- Type

/* Type(name: String, spec: Object) => Type
 *
 * Creates a new custom type
 *
 * Example:
 * 
 *   const MyType = Type("MyType", { x: Number, y: String })
 *   myType       = MyType(1, "foo")
 *
 *   myType.x  // => 1
 *   myType.y  // => "foo"
 * 
 *   MyType("foo", 1) //=> TypeError
 */

export const Type = (name, spec) => {
  if (process.env.NODE_ENV !== "production") {
    if (!is(name, String))
      throw new TypeError('Type requires a name parameter')
    
    if (!is(spec, Object))
      throw new TypeError('Type requires a specification')
  }

  const specKeys = Object.keys(spec)
  
  function _Type (...args) {
    if (!(this instanceof _Type)) return new _Type(...args)
    this[IMMUNE_NAME_SYM] = name
    
    
    args = args.filter(arg => arg !== undefined)
    
    if (process.env.NODE_ENV !== "production") {
      if (args.length < specKeys.length)
        throw new TypeError(`Too few arguments ${args.length}/${specKeys.length} passed to type constructor: ${name}`)
      
      if (args.length > specKeys.length)
        throw new TypeError(`Too many arguments ${args.length}/${specKeys.length} passed to type constructor: ${name}`)
      
      if (args.filter((x, i) => !is(x, spec[specKeys[i]] === undefined ? this : spec[specKeys[i]])).length) 
        throw new TypeError(`The type of the arguments passed to type constructor ${this.constructor} does not match the expected types`)
    }

    specKeys.forEach((key, i) => {
      this[key] = args[i]
    })

    this.toJSONValue = function () {
      if (process.env.NODE_ENV !== "production") {
        if (specKeys.some(key => spec[key] === Function))
          throw new TypeError(`Unable to serialize ${this.constructor} since it contains functions.`)
      }

      return specKeys.reduce((acc, key) => (acc[key] = this[key], acc), {})
    }

    this.typeName = function () {
      return name
    }
  }

  _Type.constructor = Type
  
  try {
    EJSON.addType(name, json => {
      return _Type(...specKeys.map(key => json[key]))
    })
  } catch (ex) {}

  _Type.prototype.toString = function () {
    return `${name}({ ${Object.keys(spec).map(key => `${key}: ${show(this[key])}`).join(', ')} })`
  }

  _Type.toString = function () {
    return `${name}({ ${Object.keys(spec).map(key => `${key}: ${typeToStr(spec[key])}`).join(', ')} })`
  }
  
  IAssociative(_Type,
    { get   : ( self, key ) =>
        maybe(self[key])
        
    , assoc : (self, key, val) => 
        _Type(...specKeys.map(specKey => specKey === key ? val : self[key]))
        
    , keys  : self => specKeys
    , vals  : self => specKeys.map(key => self[key])
    }
  )
  
  return _Type
}
Type.prototype = Object.create({})