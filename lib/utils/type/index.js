function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import EJSON from "meteor-ejson";

import { show, is } from '../../index';

import { typeToStr } from '../type-to-str';

import { IMMUNE_NAME_SYM } from "../../symbols";

import { IAssociative } from "../../protocols/iassociative";

import { maybe } from "../../types/maybe";

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

export var Type = function Type(name, spec) {
  if (process.env.NODE_ENV !== "production") {
    if (!is(name, String)) throw new TypeError('Type requires a name parameter');

    if (!is(spec, Object)) throw new TypeError('Type requires a specification');
  }

  var specKeys = Object.keys(spec);

  function _Type() {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (!(this instanceof _Type)) return new (Function.prototype.bind.apply(_Type, [null].concat(_toConsumableArray(args))))();
    this[IMMUNE_NAME_SYM] = name;

    args = args.filter(function (arg) {
      return arg !== undefined;
    });

    if (process.env.NODE_ENV !== "production") {
      if (args.length < specKeys.length) throw new TypeError('Too few arguments ' + args.length + '/' + specKeys.length + ' passed to type constructor: ' + name);

      if (args.length > specKeys.length) throw new TypeError('Too many arguments ' + args.length + '/' + specKeys.length + ' passed to type constructor: ' + name);

      if (args.filter(function (x, i) {
        return !is(x, spec[specKeys[i]] === undefined ? _this : spec[specKeys[i]]);
      }).length) throw new TypeError('The type of the arguments passed to type constructor ' + this.constructor + ' does not match the expected types');
    }

    specKeys.forEach(function (key, i) {
      _this[key] = args[i];
    });

    this.toJSONValue = function () {
      var _this2 = this;

      if (process.env.NODE_ENV !== "production") {
        if (specKeys.some(function (key) {
          return spec[key] === Function;
        })) throw new TypeError('Unable to serialize ' + this.constructor + ' since it contains functions.');
      }

      return specKeys.reduce(function (acc, key) {
        return acc[key] = _this2[key], acc;
      }, {});
    };

    this.typeName = function () {
      return name;
    };
  }

  _Type.constructor = Type;

  try {
    EJSON.addType(name, function (json) {
      return _Type.apply(undefined, _toConsumableArray(specKeys.map(function (key) {
        return json[key];
      })));
    });
  } catch (ex) {}

  _Type.prototype.toString = function () {
    var _this3 = this;

    return name + '({ ' + Object.keys(spec).map(function (key) {
      return key + ': ' + show(_this3[key]);
    }).join(', ') + ' })';
  };

  _Type.toString = function () {
    return name + '({ ' + Object.keys(spec).map(function (key) {
      return key + ': ' + typeToStr(spec[key]);
    }).join(', ') + ' })';
  };

  IAssociative(_Type, { get: function get(self, key) {
      return maybe(self[key]);
    },

    assoc: function assoc(self, key, val) {
      return _Type.apply(undefined, _toConsumableArray(specKeys.map(function (specKey) {
        return specKey === key ? val : self[key];
      })));
    },

    keys: function keys(self) {
      return specKeys;
    },
    vals: function vals(self) {
      return specKeys.map(function (key) {
        return self[key];
      });
    }
  });

  return _Type;
};
Type.prototype = Object.create({});