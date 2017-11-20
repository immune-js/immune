var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

import { IAssociative, IKeyed, IIndexed, IMonoid, IFunctor, IBind, ICollection, IShow } from '../../protocols';

import { Maybe, maybe, getOrElse } from "../maybe";

import { caseOf } from '../../utils/union';

import { augments } from '../../utils/protocol';

/*
 * assocIn(coll: IAssociative, path: [OneOf(String, Number)], val: Any) => IAssociative
 * 
 * Non-destructively update deeply nested values inside of an associative data structure
 *
 * Example:
 *
 *   assocIn({ x: { y: [1, 2, 3] } }, ['x', 'y', 0], 44) // => { x: { y: [44, 2, 3] } }
 *   assocIn([ 1, { y: { z: 1  } } ], [1, 'y', 'z'], 44) // => [ 1, { y: { z: 44  } } ]
 * 
 */

export var assocIn = function assocIn(coll, _ref, value) {
  var _ref2 = _toArray(_ref),
      k = _ref2[0],
      ks = _ref2.slice(1);

  return ks.length > 0 ? caseOf(IAssociative.get(coll, k), { Some: function Some(x) {
      return IAssociative.assoc(coll, k, assocIn(x, ks, value));
    },
    None: function None() {
      return IAssociative.assoc(coll, k, assocIn(IMonoid.empty(coll), ks, value));
    }
  }) : k == null ? value : IAssociative.assoc(coll, k, value);
};

/*
 * dissocIn(coll: IAssociative, path: [OneOf(String, Number)]) => IAssociative
 * 
 * Non-destructively remove deeply nested values inside of an associative data structure
 *
 * Example:
 *
 *   dissocIn({ x: { y: [1, 2, 3] } }, ['x', 'y'])    // => { x: { } }
 * 
 */

export var dissocIn = function dissocIn(coll, _ref3) {
  var _ref4 = _toArray(_ref3),
      k = _ref4[0],
      ks = _ref4.slice(1);

  return ks.length > 0 ? caseOf(IAssociative.get(coll, k), { Some: function Some(x) {
      return IAssociative.assoc(coll, k, dissocIn(x, ks));
    },
    None: function None() {
      return IAssociative.assoc(coll, k, dissocIn(IMonoid.empty(coll), ks));
    }
  }) : IKeyed.dissoc(coll, k);
};

/* get_(coll: IAssociative, key: OneOf(String, Number)) => Any
 *
 * Unsafe version of get that doesn't wrap the result in a maybe
 *
 * Example:
 *   
 *   get_({ x: 1, y: 2 }, "x") // => 1
 *   get_({ x: 1, y: 2 }, "z") // => undefined
 */

export var get_ = function get_(coll, key) {
  return caseOf(IAssociative.get(coll, key), { Some: function Some(x) {
      return x;
    }, None: function None() {
      return undefined;
    } });
};

/*
 * getIn(coll: IAssociative, path: [OneOf(String, Number)], default: Optional(Any)) => Maybe(Any) | Any
 * 
 * Extract a deeply nested value inside of an associative data structure, the result 
 * will be wrapped in a maybe, unless a default value is provided, since there might 
 * not be a value at the specified path
 *
 * Example:
 *
 *   getIn({ x: { y: [1, 2, 3] } }, ['x', 'y', 0]) // => Some(1)
 *   getIn({ x: { y: [1, 2, 3] } }, ['x', 'y', 6]) // => None( )
 *   getIn([ 1, { y: { z: 1  } } ], [1, 'y', 'z']) // => Some(1)
 *   getIn([ 1, { y: { z: 1  } } ], [1, 'y', 'x']) // => None( )
 *
 *   getIn({ x: { y: [1, 2, 3] } }, ['x', 'y', 0], 10) // => 1
 *   getIn({ x: { y: [1, 2, 3] } }, ['x', 'y', 6], 10) // => 10 
 * 
 */

export var getIn = function getIn(coll, path, defaultValue) {
  var res = foldl(path, maybe(coll), function (acc, key) {
    return IBind.andThen(acc, function (coll) {
      return augments(coll, IAssociative) ? IAssociative.get(coll, key) : Maybe.None();
    });
  });

  return defaultValue != null ? getOrElse(res, defaultValue) : res;
};

/* getIn_(coll: IAssociative, path: [OneOf(String, Number)]) => Any
 *
 * Unsafe version of getIn that doesn't wrap the result in a maybe
 *
 * Example:
 *   
 *   getIn_({ x: { y: 1 } }, ["x", "y"]) // => 1
 *   getIn_({ x: { y: 1 } }, ["x", "z"]) // => undefined
 */

export var getIn_ = function getIn_(coll, path) {
  return caseOf(getIn(coll, path), { Some: function Some(x) {
      return x;
    }, None: function None() {
      return undefined;
    } });
};

/*
 * foldl(xs: ICollection, accumulator: Any, reducer: Function) => ICollection
 * 
 * Folds a collection into a diffent value by incrementally (starting from the left) 
 * accumulating the result of calling a function with the previous and current value.
 *
 * Example:
 *
 *   foldl({ x: 1, y: 2, z: 3 }, 0, (acc, [k, v]) => acc + v) // => 6
 *   foldl([ 1, 2, 3, 4, 5, 6 ], 0, (acc, n     ) => acc + n) // => 21
 * 
 */

export var foldl = function foldl(coll, acc, f) {
  return caseOf(ICollection.first(coll), { Some: function Some(val) {
      return foldl(ICollection.rest(coll), f(acc, val), f);
    },
    None: function None() {
      return acc;
    }
  });
};

/*
 * foldr(xs: ICollection, accumulator: Any, reducer: Function) => ICollection
 * 
 * Like foldl but starting from the right
 *
 * Example:
 *
 *   foldr({ x: 2, y: 4 }, 8, (acc, [k, v]) => acc / v) // => 1
 *   foldr([ 2, 4       ], 8, (acc, n     ) => acc / n) // => 1
 * 
 */

export var foldr = function foldr(coll, acc, f) {
  return caseOf(last(coll), { Some: function Some(val) {
      return foldr(butLast(coll), f(acc, val), f);
    },
    None: function None() {
      return acc;
    }
  });
};

/*
 * foldValues(xs: ICollection, accumulator: Any, reducer: Function) => ICollection
 * 
 * Like foldl but always provides only the value whereas foldl will pass 
 * key/value pairs relevant collections
 *
 * Example:
 *
 *   foldValues({ x: 1, y: 2, z: 3 }, 0, (acc, n) => acc + n) // => 6
 *   foldValues([ 1, 2, 3, 4, 5, 6 ], 0, (acc, n) => acc + n) // => 21
 * 
 */

export var foldValues = function foldValues(coll, acc, f) {
  return foldl(coll, acc, augments(coll, IIndexed) ? f : function (acc, _ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        _ = _ref6[0],
        v = _ref6[1];

    return f(acc, v);
  });
};

/*
 * foldKV(coll: IAssociative, acc: Any, f: Function) => Any
 *
 * Like foldl but will alway pass a key/value pair, even for indexed collections
 *
 * Example:
 *
 *   foldKV({ x: 1, y: 2 }, [], (acc, [k, v]) => ICollection.conj(acc, [k, v])) // => [["x", 1], ["y", 2]]
 *   foldKV([ 1, 2, 3    ], [], (acc, [k, v]) => ICollection.conj(acc, [k, v])) // => [[0, 1], [1, 2], [2, 3]]
 *   foldKV("foo"         , [], (acc, [k, v]) => ICollection.conj(acc, [k, v])) // => [[0, "f"], [1, "o"], [2, "0"]]
 *
 */

export var foldKV = function foldKV(coll, acc, f) {
  return foldl(IAssociative.keys(coll), acc, function (acc, key) {
    return caseOf(IAssociative.get(coll, key), { Some: function Some(val) {
        return f(acc, [key, val]);
      }, None: function None() {
        return acc;
      } });
  });
};

/*
 * mapKV(coll: IAssociative, f: Function) => Any
 *
 * Like map but will alway pass a key/value pair, even for indexed collections, and 
 * always returns a list of results
 *
 * Example:
 *
 *   mapKV({ x: 1, y: 2 }, ([k, v]) => [k, v]) // => [ [ "x", 1   ], [ "y", 2   ]             ]
 *   mapKV([ 1, 2, 3    ], ([k, v]) => [k, v]) // => [ [  0 , 1   ], [  1 , 2   ], [ 2, 3   ] ]
 *   mapKV("foo"         , ([k, v]) => [k, v]) // => [ [  0 , "f" ], [  1 , "o" ], [ 2, "o" ] ]
 *
 */

export var mapKV = function mapKV(coll, f) {
  return foldKV(coll, [], function (acc, _ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        k = _ref8[0],
        v = _ref8[1];

    return ICollection.conj(acc, f([k, v]));
  });
};

/*
 * mapKeys(coll: IAssociative, f: Function) => Any
 *
 * Like map but will alway pass the key rather than value, even for indexed collections, and 
 * always returns a list of results
 *
 * Example:
 *
 *   mapKeys({ x: 1, y: 2 }, k => k) // => [ "x", "y"    ]
 *   mapKeys([ 1, 2, 3    ], k => k) // => [  0 ,  1 , 2 ]
 *   mapKeys("foo"         , k => k) // => [  0 ,  1 , 2 ]
 *
 */

export var mapKeys = function mapKeys(coll, f) {
  return mapKV(coll, function (_ref9) {
    var _ref10 = _slicedToArray(_ref9, 2),
        k = _ref10[0],
        _ = _ref10[1];

    return f(k);
  });
};

/*
 * count(xs: ICollection) => Number
 *
 * Returns the number of elements contained in the collection
 *
 *   Example:
 *   
 *     count([ 1, 2, 3          ]) // => 3
 *     count({ x: 1, y: 2, z: 3 }) // => 3
 *
 */

export var count = function count(xs) {
  return foldl(xs, 0, function (acc, x) {
    return acc + 1;
  });
};

/*
 * last(xs: ICollection) => Maybe(Any)
 *
 * Returns the last element in a collection, since there might 
 * not be a last element the result is wrapped in a maybe
 *
 *   Example:
 *   
 *     last([ 1, 2, 3          ]) // => Some(3)
 *     last([                  ]) // => None( )
 *     last({ x: 1, y: 2, z: 3 }) // => Some(3)
 *     last({                  }) // => None(3)
 *
 */

export var last = function last(xs) {
  var rest = ICollection.rest(xs);

  return count(rest) === 0 ? ICollection.first(xs) : last(rest);
};

/*
 * butLast(xs: ICollection) => ICollection
 *
 * Returns a new collection containing all the elements of the 
 * original collection except the last one
 *
 *   Example:
 *   
 *     butLast([ 1, 2, 3          ]) // => [ 1, 2, 3    ]
 *     butLast([                  ]) // => [            ]
 *     butLast({ x: 1, y: 2, z: 3 }) // => { x: 1, y: 2 }
 *     butLast({                  }) // => {            }
 *
 */

export var butLast = function butLast(xs) {
  return function recur(acc, xs) {
    if (count(xs) === 1) return acc;

    return caseOf(ICollection.first(xs), { Some: function Some(val) {
        return recur(ICollection.conj(acc, val), ICollection.rest(xs));
      },
      None: function None() {
        return acc;
      }
    });
  }(IMonoid.empty(xs), xs);
};

/* 
 * filter(xs: ICollection, predicate: Function) => ICollection
 *
 * Creates a new collection containing only the elements that satisfies the predicate
 * 
 * Example:
 *
 *   filter([1, 2, 3], n => x <=  2) // => [1, 2]
 *   filter([1, 2, 3], n => x === 2) // => [2]
 *
 *   filter({ x: 1, y: 2, z: 3 }, ([k, v]) => v <=  2) // => { x: 1, y: 2 }
 *   filter({ x: 1, y: 2, z: 3 }, ([k, v]) => v === 2) // => { y: 2 }
 *
 */

export var filter = function filter(self, f) {
  return typeof self.filter === "function" ? self.filter(f) : foldl(self, IMonoid.empty(self), function (acc, v) {
    return f(v) ? ICollection.conj(acc, v) : acc;
  });
};

/* 
 * some(xs: ICollection, predicate: Function) => Boolean
 *
 * Iterates through a collection to see if at least one element satisfies the predicate function
 * 
 * Example:
 *
 *   some([1, 2, 3           ], n => n === 2) // => true
 *   some([1, 2, 3           ], n => n === 5) // => false
 *
 *   some({ x: 1, y: 2, z: 3 }, n => n === 2) // => true
 *   some({ x: 1, y: 2, z: 3 }, n => n === 5) // => false
 *
 */

export var some = function some(self, f) {
  return typeof self.some === "function" ? self.some(f) : foldl(self, false, function (acc, v) {
    return acc || f(v);
  });
};

/* 
 * every(xs: ICollection, predicate: Function) => Boolean
 *
 * Iterates through a collection to see if every element satisfies the predicate function
 * 
 * Example:
 *
 *   every([1, 2, 3           ], n => n <=  3) // => true
 *   every([1, 2, 3           ], n => n === 2) // => false
 *
 *   every({ x: 1, y: 2, z: 3 }, n => n <=  3) // => true
 *   every({ x: 1, y: 2, z: 3 }, n => n === 2) // => false
 *
 */

export var every = function every(self, f) {
  return typeof self.every === "function" ? self.every(f) : foldl(self, true, function (acc, v) {
    return !f(v) ? false : acc;
  });
};

/*
 * find(coll: ICollection, predicate: Function) => Maybe(Any)
 *
 * Applies a predicate function to each value in a collection returning 
 * the first entry for wich the predicate returns true wrapped in a maybe
 *
 * Example:
 *
 *   find([1, 2, 3], x => x === 2           ) // => Some(2)
 *   find([1, 2, 3], x => x === 2 || x === 3) // => Some(2)
 *   find([1, 2, 3], x => x === 6           ) // => None( )
 *
 *   find({ x: 1, y: 2, z: 3 }, ([k, v]) => v === 2             ) => Some(["y", 2])
 *   find({ x: 2, y: 2, z: 2 }, ([k, v]) => k === "y" && v === 2) => Some(["y", 2])
 *   find({ x: 1, y: 2, z: 3 }, ([k, v]) => v === 6             ) => None()
 *
 */

export var find = function find(coll, predicate) {
  return foldl(coll, Maybe.None(), function (acc, val) {
    return caseOf(acc, { Some: function Some(x) {
        return acc;
      }, None: function None() {
        return predicate(val) ? Maybe.Some(val) : acc;
      } });
  });
};

/*
 * into(to: ICollection, from: ICollection)
 *
 * Produces a new collection by conjoining all the items of 'from' onto 'to'
 *
 * Example:
 * 
 *   into({ a: 1, b: 2, c: 3 }, [])           // => [["a", 1], ["b", 2], ["c", 3]]
 *   into([["a", 1], ["b", 2], ["c", 3]], {}) // => { a: 1, b: 2, c: 3 }
 *   into([1, 2, 3], [])                      // => [1, 2, 3]
 *
 */

export var into = function into(from, to) {
  return foldl(from, to, function (acc, x) {
    return ICollection.conj(acc, x);
  });
};

export var mergeDeep = function mergeDeep(a, b) {
  return foldl(b, a, function (acc, _ref11) {
    var _ref12 = _slicedToArray(_ref11, 2),
        key = _ref12[0],
        val = _ref12[1];

    return caseOf(IAssociative.get(acc, key), { Some: function Some(x) {
        return IAssociative.assoc(acc, key, augments(x, IAssociative) ? mergeDeep(x, val) : val);
      },
      None: function None() {
        return IAssociative.assoc(acc, key, val);
      }
    });
  });
};

/*
 * slice(coll: ICollection, from: Optional(Number), to: Optional(Number)) => ICollection
 *
 * Returns a subset of a collection given a starting and ending index.
 *  - from defaults to 0
 *  - to   defaults to count(coll)
 *
 * Example:
 *
 *   slice("barbaz", 1, 4)                                 // => "arb"
 *   slice("barbaz", 1   )                                 // => "arbaz"
 *   slice("barbaz"      )                                 // => "barbaz"
 *
 *   slice([1,2,3,4,5,6], 1, 4)                            // => [2, 3, 4]
 *   slice([1,2,3,4,5,6], 1   )                            // => [2, 3, 4, 5, 6]
 *   slice([1,2,3,4,5,6],     )                            // => [1, 2, 3, 4, 5, 6]
 *
 *   slice({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }, 1, 4)   // => { b: 2, c: 3, d: 4 }
 *   slice({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }, 1   )   // => { b: 2, c: 3, d: 4, e: 5, f: 6 }
 *   slice({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 },     )   // => { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }
 */

export var slice = function slice(coll) {
  var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var to = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : count(coll);
  return typeof coll.slice === "function" ? coll.slice(from, to) : into(into(coll, []).slice(from, to), IMonoid.empty(coll));
};

/*
 * join(coll: ICollection, separator: String) => String
 *
 * Stringifies the values of a collection and joins them together 
 * with a separator in between
 *
 * Example:
 *
 *   join([1, 2, 3]               , ", ") // => "1, 2, 3"
 *   join({ x: [1, 2], y: [1, 2] }, ", ") // => "[ 1, 2 ], [ 3, 4 ]"
 *   join("foobar"                , ", ") // => "f, o, o, b, a, r"
 *
 */
export var join = function join(coll, separator) {
  return foldValues(coll, "", function (acc, val) {
    var str = typeof val === "string" ? val : IShow.show(val);
    return acc === "" ? str : acc + separator + str;
  });
};

/*
 * sum(coll: ICollection) => Number
 *
 * Returns the sum of all the values in a collection of numbers
 *
 * Example:
 *   
 *   sum([ 1, 2, 3, 4, 5, 6                   ])   // => 21
 *   sum({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 })   // => 21
 */

export var sum = function sum(coll) {
  return foldValues(coll, 0, function (a, b) {
    return a + b;
  });
};

/*
 * product(coll: ICollection) => Number
 *
 * Returns the product of all the values in a collection of numbers
 *
 * Example:
 *   
 *   sum([ 1, 2, 3, 4, 5, 6                   ])   // => 720
 *   sum({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 })   // => 720
 */

export var product = function product(coll) {
  return foldValues(coll, 1, function (a, b) {
    return a * b;
  });
};

/*
 * avg(self: ICollection) => Number
 *
 * Calculates the average (sum/amount) of a collection of numbers
 *
 * Example: 
 *   
 *   const numberArr = [3, 4, 8]
 * 
 *   avg(numberArr)                                    //=> 5
 *   avg(numberArr) === (3 + 4 + 8) / count(numberArr) // => true
 *
 *   const numberObj = { x: 3, y: 4, z: 8 }
 *
 *   avg(numberObj)                                    //=> 5
 *   avg(numberObj) === (3 + 4 + 8) / count(numberObj) // => true
 */

export var avg = function avg(coll) {
  return sum(coll) / count(coll);
};