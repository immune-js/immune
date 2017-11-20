var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { IAssociative, IKeyed, ICollection, IMonoid, IFunctor, IFoldable, IShow, IEqual } from "../../protocols";

import { curry } from "../function";

import { caseOf } from "../../utils/union";

import { Some as _Some, None as _None, maybe, getOrElse } from "../maybe";

import { foldl } from "../collection";

/*
 * Extends IFunctor to work over objects
 *
 * Example:
 *
 *   IFunctor.map({ x: 1, y: 2 }, x => x + 1) //=> [2, 3]
 */

IFunctor(Object, { map: function map(self, f) {
    return Object.keys(self).map(function (key) {
      return curry(f)([key, self[key]]);
    });
  }
});

/*
 * Extends IAssociative to work over objects
 *
 * Example:
 *
 *   IAssociative.assoc ({ x: 1, y: 2 }, "x", 4)  // => { x: 4, y: 2       }
 *   IAssociative.assoc ({ x: 1, y: 2 }, "z", 4)  // => { x: 1, y: 2, z: 4 }
 *
 *   IAssociative.get   ({ x: 1, y: 2 }, "x"    ) // => Some(1)
 *   IAssociative.get   ({ x: 1, y: 2 }, "z"    ) // => None
 *
 *   IAssociative.get   ({ x: 1, y: 2 }, "x", 4 ) // => 1
 *   IAssociative.get   ({ x: 1, y: 2 }, "z", 4 ) // => 4
 *
 */

IAssociative(Object, { assoc: function assoc(self, key, val) {
    return _extends({}, self, _defineProperty({}, key, val));
  },

  get: function get(self, key, defaultValue) {
    return defaultValue == null ? maybe(self[key]) : getOrElse(maybe(self[key]), defaultValue);
  },

  keys: function keys(self) {
    return Object.keys(self);
  },

  vals: function vals(self) {
    return IAssociative.keys(self).map(function (k) {
      return self[k];
    });
  }
});

/*
 * Extends IKeyed to work over objects
 *
 * Example:
 *
 *   IKeyed.dissoc ({ x: 1, y: 2, z: 3 }, "y")  // => { x: 1, z: 3 }
 *
 */

IKeyed(Object, { dissoc: function dissoc(self, k) {
    return Object.keys(self).filter(function (key) {
      return key !== k;
    }).reduce(function (acc, key) {
      return acc[key] = self[key], acc;
    }, {});
  }
});

/*
 * Extends ICollection to work over objects
 *
 * Example:
 *
 *   ICollection.first ({ x: 1, y: 2       }) // => Some(["x", 1])
 *   ICollection.first ({                  }) // => None()
 *
 *   ICollection.rest  ({ x: 1, y: 2, z: 3 }) // => { y: 2, z: 3 }
 *   ICollection.rest  ({ x: 1             }) // => { }
 *
 *   ICollection.conj ({ x: 1 }, ["y", 2]          )  // => { x: 1, y: 2 }
 *   ICollection.conj ({ x: 1 }, ["y", 2], ["z", 3])  // => { x: 1, y: 2, z: 3 }
 *   ICollection.conj ({ x: 1 }, { y: 2, z: 3     })  // => { x: 1, y: 2, z: 3 }
 *
 */

ICollection(Object, { first: function first(self) {
    return caseOf(IAssociative.get(Object.keys(self), 0), { Some: function Some(key) {
        return _Some([key, self[key]]);
      },
      None: function None() {
        return _None();
      }
    });
  },

  rest: function rest(self) {
    return Object.keys(self).slice(1).reduce(function (acc, key) {
      return _extends({}, acc, _defineProperty({}, key, self[key]));
    }, {});
  },

  conj: function conj(self) {
    for (var _len = arguments.length, entries = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      entries[_key - 1] = arguments[_key];
    }

    return entries.reduce(function (acc, entry) {
      if (Array.isArray(entry)) {
        var _entry = _slicedToArray(entry, 2),
            k = _entry[0],
            v = _entry[1];

        return Object.assign(acc, _defineProperty({}, k, v));
      }
      if (entry && entry.constructor) {
        return Object.assign(acc, entry);
      }
    }, Object.assign({}, self));
  }
});

/*
 * Extends IMonoid to work over Objects
 *
 *   Example:
 *
 *     empty({ x: 1, y: 2 })      // => {}
 *     concat({ x: 1 }, { y: 2 }) // => { x: 1, y: 2 }
 *
 */

IMonoid(Object, { empty: function empty(self) {
    return {};
  },
  concat: function concat(self) {
    for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      rest[_key2 - 1] = arguments[_key2];
    }

    return Object.assign.apply(Object, [{}, self].concat(rest));
  }
});

/*
 * Extends IEqual to work over objects
 *
 * Example:
 *
 *   equals({ x: 1, y: 2, z: 3 }    , { x: 1, y: 2, z: 3 }    ) // => true
 *   equals({ x: 1, y: 2, z: 3 }    , { a: 1, b: 2, c: 3 }    ) // => false
 *   equals({ x: 1, y: 2, z: 3 }    , { x: 3, y: 2, z: 1 }    ) // => false
 *   equals({ x: { y: 2 }, z: [3] } , { x: { y: 2 }, z: [3] } ) // => true
 *
 */

IEqual(Object, { equals: function equals(self, other) {
    return Object.keys(self).every(function (key) {
      return IEqual.equals(self[key], other[key]);
    });
  }
});

/*
 * Extends IShow to work over objects
 *
 * Example:
 *
 *   IShow.show({ x: 1, y: 2 }) //=> "{ x: 1, y: 2 }"
 */

IShow(Object, { show: function show(self) {
    return "{ " + Object.keys(self).map(function (key) {
      return key + ": " + IShow.show(self[key]);
    }).join(", ") + " }";
  }
});

/*
 * evolve(coll: IAssociative, transformations: Object) => IAssociative
 *
 * Given an associative collection and a "receipt" of changes it returns a 
 * new copy of the original collection with the changes applied.
 *
 * Example:
 *
 *   evolve({ a: 1, b: { c: 4, d: [3, 4] } },
 *     { a: 3
 *     , b: { c: 8
 *          , d: coll => concat(getOrElse(coll, []), [5, 6])
 *          , f: coll => concat(getOrElse(coll, []), [1, 2]) 
 *          }
 *     }
 *   ) // => { a: 3, b: { c: 8, d: [3, 4, 5, 6], f: [1, 2] } }
 */

export var evolve = function evolve(object, transformations) {
  return foldl(transformations, object, function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        transformation = _ref2[1];

    return IAssociative.assoc(acc, key, typeof transformation === "function" ? transformation(IAssociative.get(object, key)) : transformation && transformation.constructor === Object ? IFoldable.fold(IAssociative.get(object, key), function (obj) {
      return obj.constructor === Object ? evolve(obj, transformation) : evolve(Array.isArray(obj) ? [] : {}, transformation);
    }, function () {
      return evolve({}, transformation);
    }) : transformation);
  });
};