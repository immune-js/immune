function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import EJSON from "meteor-ejson";

import { show, is } from "../../index";

import { typeToStr } from "../type-to-str";

import { IMMUNE_TYPES_SYM, IMMUNE_TYPE_SYM, IMMUNE_NAME_SYM, IMMUNE_ARITIES_SYM, IMMUNE_ARGS_SYM, IMMUNE_KEYES_SYM } from "../../symbols";

/* Union(name: String, spec: Spec) => Union
 *
 * Creates a new union type
 *
 * Example:
 *   
 *   const MaybeString = Union("MaybeString", { Some: [String], None: [] })
 *   
 *   MaybeString.Some("foo")                             //=> MaybeString.Some("foo")
 *   MaybeString.Some("foo") instanceof MaybeString.Some //=> true
 *   MaybeString.None()                                  //=> MaybeString.None()
 *   MaybeString.None() instanceof MaybeString.None      //=> true
 */

export var Union = function Union(name, spec) {
  if (process.env.NODE_ENV !== "production") {
    if (typeof name !== "string") throw new TypeError("Union requires a name parameter");

    if (!spec || spec.constructor !== Object) throw new TypeError("Union requires a specification");
  }

  var specKeys = Object.keys(spec);

  var union = function union() {
    for (var _len = arguments.length, types = Array(_len), _key = 0; _key < _len; _key++) {
      types[_key] = arguments[_key];
    }

    if (!(this instanceof union)) return new (Function.prototype.bind.apply(union, [null].concat(types)))();

    this[IMMUNE_TYPES_SYM] = types;

    this.toString = function () {
      return name + "(" + types.map(function (x) {
        return typeToStr(x);
      }) + ")";
    };
  };
  union[IMMUNE_KEYES_SYM] = specKeys;
  union[IMMUNE_NAME_SYM] = name;
  union[IMMUNE_TYPE_SYM] = Union;
  union[IMMUNE_ARITIES_SYM] = specKeys.map(function (key) {
    return spec[key].length;
  });
  union.prototype = Object.create(Union.prototype);
  union.prototype.constructor = Union;

  specKeys.forEach(function (key) {
    function _Case() {
      var _this = this;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      if (!(this instanceof _Case)) return new (Function.prototype.bind.apply(_Case, [null].concat(_toConsumableArray(args))))();

      args = args.filter(function (arg) {
        return arg !== undefined;
      });

      if (args.length > spec[key].length) args = args.slice(0, spec[key].length);

      this[IMMUNE_TYPE_SYM] = key;
      this[IMMUNE_NAME_SYM] = name + "." + key;

      this.toString = function () {
        return name + "." + key + "(" + args.map(function (x) {
          return show(x);
        }).join(', ') + ")";
      };

      if (process.env.NODE_ENV !== "production") {
        if (args.length < spec[key].length) throw new TypeError("Too few arguments passed to type constructor " + this);

        if (args.length > spec[key].length) throw new TypeError("Too many arguments passed to type constructor " + this);

        spec[key].forEach(function (T, i) {
          if (!is(args[i], T === void 0 ? _this.constructor : T)) {
            throw new TypeError("The type of the arguments passed to type constructor " + _this + " does not match the expected types");
          }
        });
      }

      this.toJSONValue = function () {
        return { args: args, type: key };
      };
      this.typeName = function () {
        return name + "." + key;
      };

      this[IMMUNE_ARGS_SYM] = args;
    }

    union[key] = _Case;

    try {
      EJSON.addType(name + "." + key, function (json) {
        return union[json.type].apply(union, _toConsumableArray(json.args));
      });
    } catch (ex) {}

    _Case.prototype = Object.create(union.prototype);
    _Case.prototype.constructor = union;

    _Case.prototype.caseOf = function (pattern) {
      return caseOf(this, pattern);
    };
  });

  union.toString = function () {
    return name;
  };

  return union;
};

Union.prototype = Object.create({});

/*
 * caseOf(union: Union, pattern: Object) => Any
 *
 * Pattern match over a union type, throw an error if pattern is Non-exhaustive.
 * The underscore (_) symbol can be used as a catch-all pattern.
 *
 * Example:
 *
 *   caseOf(Some(2), { Some: v  => v + 2, None: () => 0 }) // => 4
 *   caseOf(None( ), { Some: v  => v + 2, None: () => 0 }) // => 0
 *   caseOf(None( ), { Some: v  => v + 2, _   : () => 0 }) // => 0
 *   caseOf(Some(2), { _   : () => 0                    }) // => 0
 *   caseOf(None( ), { _   : () => 0                    }) // => 0
 *   caseOf(Some(2), { Some: v  => v + 2                }) // => TypeError('Non-exhaustive pattern provided for union type Some)
 */

export var caseOf = function caseOf(union, pattern) {
  if (process.env.NODE_ENV !== "production") {
    if (!pattern || pattern.constructor !== Object) throw new TypeError("caseOf(pattern, ut) requires a pattern to match against");

    if (!is(union, Union)) throw new TypeError("caseOf(pattern, ut) requires an instance of a union type to match on");

    if (!union.constructor[IMMUNE_KEYES_SYM].every(function (key) {
      return !!pattern[key];
    }) && !pattern._) throw new TypeError("Non-exhaustive pattern provided for union type " + union.constructor[IMMUNE_NAME_SYM]);
  }

  var matcher = pattern[union[IMMUNE_TYPE_SYM]];

  return (matcher || pattern._).apply(undefined, _toConsumableArray(union[IMMUNE_ARGS_SYM]));
};