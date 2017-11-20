import 
  { Any
  } from "./any"

import 
  { ITypeCheck
  } from "../../protocols"

import
  { augments
  } from "../../utils/protocol"

import
  { Union
  } from "../../utils/union"

import
  { IMMUNE_TYPES_SYM
  , IMMUNE_TYPE_SYM
  , IMMUNE_ARITIES_SYM
  , IMMUNE_ARGS_SYM
  , IMMUNE_KEYES_SYM
  } from "../../symbols"

export * from './any'

/*
 * is(value : Any, type : Any) => Boolean
 * 
 * Checks if an object is of a certain type
 *
 * Example:
 * 
 *   // Primitive Values
 *
 *   is( "foo"              , String                   ) // => true
 *   is( "foo"              , Number                   ) // => false
 *   
 *   // Union Types
 *
 *   is( Just(2)            , Maybe(Number)            ) // => true
 *   is( Just(2)            , Maybe(String)            ) // => false
 *
 *   // Type Shapes
 *   
 *   is( [ 1, 2, 3        ] , [Number]                 ) // => true
 *   is( [ 1, '2', '3'    ] , [Number]                 ) // => false
 *   is( { x: 2, y: 'foo' } , { x: Number, y: String } ) // => true
 *   is( { x: 2, y: 'foo' } , { x: Number, y: Number } ) // => false
 *
 */

export const is = (v, T) => {
  if (T === Any) return true

  if (T == null && v == null) return true
  if (T == null && v != null) return false
  if (T != null && v == null) return false

  if (T.constructor === Object && v.constructor === Object) {
    return Object.keys(T).every(key => is(v[key], T[key]))
  }

  if (T instanceof Union) {
    if (process.env.NODE_ENV !== 'production') {
      const types       = T[IMMUNE_TYPES_SYM]
      const arities     = v.constructor[IMMUNE_ARITIES_SYM]
      const cases       = Object.keys(v.constructor).filter(key => key[0] === key[0].toUpperCase())
      const currentCase = v[IMMUNE_TYPE_SYM]
      
      for (let i = 0; i < cases.length; i++) {
        if (cases[i] === currentCase) {
          const curr = i === 0 ? 0 : arities.slice(0, i).reduce((acc, x) => acc + x, 0)
          return types.slice(curr, curr + arities[i]).every((type, idx) => is(v[IMMUNE_ARGS_SYM][idx], type))
        }
      }
     
      return false
    } else {
      return true
    }
  }

  if (Array.isArray(T) && T.length === 1) {
    const type = T[0]
    if (process.env.NODE_ENV !== 'production') {
      if (Array.isArray(v) && v.every(val => is(val, type)))
        return true
      else
        return false
    } else {
      return true
    }
  }
  
  if (augments(T, ITypeCheck))
    return !!ITypeCheck.typeCheck(T, v)
  
  if (augments(v, ITypeCheck))
    return !!ITypeCheck.typeCheck(v, T)

  return v != null && v.constructor === T || (typeof(T) === 'function' && v instanceof T)
}

/*
 * eq(a: Any, b: Any) => Boolean
 * 
 * Checks two values for reference equality
 *
 */
export const eq = (self, other) => 
  self === other