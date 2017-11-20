import { Union } from '../union';

import { typeToStr } from '../type-to-str';

import { Null } from '../../index';

import { IMMUNE_IS_ANY_SYM, IMMUNE_NS_SYM, IMMUNE_NAME_SYM, IMMUNE_PROTO_IMPLS_SYM, IMMUNE_PROTO_DEFAULT_SYM } from "../../symbols";

var validateProtocolInvokation = function validateProtocolInvokation(name, fnName, self, args) {
  throw new TypeError('\nI encountered a problem while executing the following expression:\n\n> ' + fnName + '(' + typeToStr(self) + (args.length ? ', ' + args.map(typeToStr).join(', ') : '') + ')\n\nMissing implementation of the protocol ' + name + ' for the type ' + typeToStr(self.constructor || self) + '\n');
};

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

export var Protocol = function Protocol(name, spec) {
  var specKeys = Object.keys(spec);

  var protocolFn = function protocolFn(Type, impls) {
    if (Type[IMMUNE_IS_ANY_SYM]) {
      protocolFn[IMMUNE_PROTO_IMPLS_SYM] = protocolFn[IMMUNE_PROTO_IMPLS_SYM] || [];
      protocolFn[IMMUNE_PROTO_IMPLS_SYM].push(name);

      protocolFn[IMMUNE_PROTO_DEFAULT_SYM] = protocolFn[IMMUNE_PROTO_DEFAULT_SYM] || {};
      protocolFn[IMMUNE_PROTO_DEFAULT_SYM][name] = protocolFn[IMMUNE_PROTO_DEFAULT_SYM][name] || {};
      Type = protocolFn[IMMUNE_PROTO_DEFAULT_SYM][name];
    } else {
      Type[IMMUNE_PROTO_IMPLS_SYM] = Type[IMMUNE_PROTO_IMPLS_SYM] || [];
      Type[IMMUNE_PROTO_IMPLS_SYM].push(name);

      Type[IMMUNE_NS_SYM] = Type[IMMUNE_NS_SYM] || {};
      Type[IMMUNE_NS_SYM][name] = Type[IMMUNE_NS_SYM][name] || {};
      Type = Type[IMMUNE_NS_SYM][name];
    }

    specKeys.forEach(function (fnName) {
      return Type[fnName] = function (self) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        if (process.env.NODE_ENV !== 'production') if (typeof impls[fnName] !== "function") validateProtocolInvokation(name, fnName, self, args);

        return impls[fnName].apply(impls, [self].concat(args));
      };
    });
  };

  protocolFn[IMMUNE_NAME_SYM] = name;

  specKeys.forEach(function (fnName) {
    protocolFn[fnName] = function (self) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      if (self != null && self.constructor && self.constructor[IMMUNE_NS_SYM] && self.constructor[IMMUNE_NS_SYM][name] && self.constructor[IMMUNE_NS_SYM][name][fnName] && typeof self.constructor[IMMUNE_NS_SYM][name][fnName] === 'function') {
        var _self$constructor$IMM;

        return (_self$constructor$IMM = self.constructor[IMMUNE_NS_SYM][name])[fnName].apply(_self$constructor$IMM, [self].concat(args));
      } else if (self != null && self[IMMUNE_NS_SYM] && self[IMMUNE_NS_SYM][name] && self[IMMUNE_NS_SYM][name][fnName] && typeof self[IMMUNE_NS_SYM][name][fnName] === 'function') {
        var _self$IMMUNE_NS_SYM$n;

        return (_self$IMMUNE_NS_SYM$n = self[IMMUNE_NS_SYM][name])[fnName].apply(_self$IMMUNE_NS_SYM$n, [self].concat(args));
      } else if (self != null instanceof Union && Union[IMMUNE_NS_SYM] && Union[IMMUNE_NS_SYM][name] && Union[IMMUNE_NS_SYM][name][fnName] && typeof Union[IMMUNE_NS_SYM][name][fnName] === 'function') {
        var _Union$IMMUNE_NS_SYM$;

        return (_Union$IMMUNE_NS_SYM$ = Union[IMMUNE_NS_SYM][name])[fnName].apply(_Union$IMMUNE_NS_SYM$, [self].concat(args));
      } else if (protocolFn[IMMUNE_PROTO_DEFAULT_SYM] && protocolFn[IMMUNE_PROTO_DEFAULT_SYM][name] && typeof protocolFn[IMMUNE_PROTO_DEFAULT_SYM][name][fnName] === 'function') {
        var _protocolFn$IMMUNE_PR;

        return (_protocolFn$IMMUNE_PR = protocolFn[IMMUNE_PROTO_DEFAULT_SYM][name])[fnName].apply(_protocolFn$IMMUNE_PR, [self].concat(args));
      } else if (self == null && Null[IMMUNE_NS_SYM][name] && typeof Null[IMMUNE_NS_SYM][name][fnName] === "function") {
        var _Null$IMMUNE_NS_SYM$n;

        return (_Null$IMMUNE_NS_SYM$n = Null[IMMUNE_NS_SYM][name])[fnName].apply(_Null$IMMUNE_NS_SYM$n, [self].concat(args));
      } else {
        if (process.env.NODE_ENV !== 'production') {
          validateProtocolInvokation(name, fnName, self, args);
        }
      }
    };
  });

  return protocolFn;
};

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
export var augments = function augments(type, protocol) {
  if (type == null) return augments(Null, protocol);

  var protocolName = protocol[IMMUNE_NAME_SYM];
  var defaultImpl = protocol[IMMUNE_PROTO_DEFAULT_SYM] && protocol[IMMUNE_PROTO_DEFAULT_SYM][protocolName];

  return !!defaultImpl || (type[IMMUNE_PROTO_IMPLS_SYM] || []).some(function (name) {
    return name === protocolName;
  }) || (type.constructor && type.constructor[IMMUNE_PROTO_IMPLS_SYM] || []).some(function (name) {
    return name === protocolName;
  });
};