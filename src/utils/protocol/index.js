import 
  { Union
  } from '../union'

import 
  { typeToStr
  } from '../type-to-str'

import
  { Null
  } from '../../index'

import 
  { IMMUNE_IS_ANY_SYM
  , IMMUNE_NS_SYM
  , IMMUNE_NAME_SYM
  , IMMUNE_PROTO_IMPLS_SYM
  , IMMUNE_PROTO_DEFAULT_SYM
  } from "../../symbols"

const validateProtocolInvokation = (name, fnName, self, args) => {
  throw new TypeError(`
I encountered a problem while executing the following expression:

> ${fnName}(${typeToStr(self)}${args.length ? ', ' + args.map(typeToStr).join(', ') : ''})

Missing implementation of the protocol ${name} for the type ${typeToStr(self.constructor || self)}
`)
}

// -- Protocol

/*
 * A protocol is a named set of named methods and their signatures that other types can extend to participate in the interface
 * 
 * Example:
 *   // Define the protocol
 *   const IShow = Protocol("IShow", { show: [Any] })
 *
 *   // Extend the protocol to the Array type
 *   IShow(Array, 
 *     { show: xs => \`Array containing the values: ${xs.join(', ')}\` 
 *     }
 *   )
 *   
 *   // 
 *   IShow.show([1,2,3]) //=> "Array containing the values: 1, 2, 3"
 */

export const Protocol = (name, spec) => {
  const specKeys = Object.keys(spec)
  
  const protocolFn = function (Type, impls) {
    if (Type[IMMUNE_IS_ANY_SYM]) {
      protocolFn[IMMUNE_PROTO_IMPLS_SYM] = protocolFn[IMMUNE_PROTO_IMPLS_SYM] || []
      protocolFn[IMMUNE_PROTO_IMPLS_SYM].push(name)
      
      protocolFn[IMMUNE_PROTO_DEFAULT_SYM]        = protocolFn[IMMUNE_PROTO_DEFAULT_SYM]       || {}
      protocolFn[IMMUNE_PROTO_DEFAULT_SYM][name]  = protocolFn[IMMUNE_PROTO_DEFAULT_SYM][name] || {}
      Type  = protocolFn[IMMUNE_PROTO_DEFAULT_SYM][name]
      
    } else {
      Type[IMMUNE_PROTO_IMPLS_SYM] = Type[IMMUNE_PROTO_IMPLS_SYM] || []
      Type[IMMUNE_PROTO_IMPLS_SYM].push(name)
      
      Type[IMMUNE_NS_SYM]       = Type[IMMUNE_NS_SYM]       || {}
      Type[IMMUNE_NS_SYM][name] = Type[IMMUNE_NS_SYM][name] || {}
      Type                 = Type[IMMUNE_NS_SYM][name]
    }
    
    specKeys.forEach(fnName =>
      Type[fnName] = (self, ...args) => {
        if (process.env.NODE_ENV !== 'production')
          if (typeof(impls[fnName]) !== "function")
            validateProtocolInvokation(name, fnName, self, args)
        
        return impls[fnName](self, ...args)
      }
    )
  }
  
  protocolFn[IMMUNE_NAME_SYM] = name
  
  specKeys.forEach(fnName => {
    protocolFn[fnName] = (self, ...args) => {
      if (self != null && self.constructor && self.constructor[IMMUNE_NS_SYM] && self.constructor[IMMUNE_NS_SYM][name] && self.constructor[IMMUNE_NS_SYM][name][fnName] && typeof(self.constructor[IMMUNE_NS_SYM][name][fnName]) === 'function') {
        return self.constructor[IMMUNE_NS_SYM][name][fnName](self, ...args)
      } else if(self != null && self[IMMUNE_NS_SYM] && self[IMMUNE_NS_SYM][name] && self[IMMUNE_NS_SYM][name][fnName] && typeof(self[IMMUNE_NS_SYM][name][fnName]) === 'function') {
        return self[IMMUNE_NS_SYM][name][fnName](self, ...args)
      } else if (self != null instanceof Union && Union[IMMUNE_NS_SYM] && Union[IMMUNE_NS_SYM][name] && Union[IMMUNE_NS_SYM][name][fnName] && typeof(Union[IMMUNE_NS_SYM][name][fnName]) === 'function') {
        return Union[IMMUNE_NS_SYM][name][fnName](self, ...args)
      } else if (protocolFn[IMMUNE_PROTO_DEFAULT_SYM] && protocolFn[IMMUNE_PROTO_DEFAULT_SYM][name] && typeof(protocolFn[IMMUNE_PROTO_DEFAULT_SYM][name][fnName]) === 'function') {
        return protocolFn[IMMUNE_PROTO_DEFAULT_SYM][name][fnName](self, ...args)
      } else if (self == null && Null[IMMUNE_NS_SYM][name] && typeof(Null[IMMUNE_NS_SYM][name][fnName]) === "function") {
        return Null[IMMUNE_NS_SYM][name][fnName](self, ...args)
      } else {
        if (process.env.NODE_ENV !== 'production') {
          validateProtocolInvokation(name, fnName, self, args)
        }
      }
    }
  })
  
  return protocolFn
}

/*
 * augments(type: Any, protocol: Protocol): Boolean
 * 
 * Check if a type implements a Protocol
 * 
 * Example:
 *   
 *   augments( 2, IShow    ) //=> true
 *   augments( 2, IFunctor ) //=> false
 *
 */
export const augments = (type, protocol) => {
  if (type == null) return augments(Null, protocol)
  
  const protocolName = protocol[IMMUNE_NAME_SYM]
  const defaultImpl  = protocol[IMMUNE_PROTO_DEFAULT_SYM] && protocol[IMMUNE_PROTO_DEFAULT_SYM][protocolName]
  
  return (!!defaultImpl) || (type[IMMUNE_PROTO_IMPLS_SYM] || []).some(name => name === protocolName) || (type.constructor && type.constructor[IMMUNE_PROTO_IMPLS_SYM] || []).some(name => name === protocolName)
}