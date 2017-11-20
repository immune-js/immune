import { IAssociative, IIndexed, ICollection, IMonoid, IFunctor, IApply, IBind, IFlatten, IEqual, IShow } from "../../protocols";

import { curry } from "../function";

import { maybe, getOrElse } from "../maybe";

/*
 * Extends IFlatten to work over arrays
 *
 * Example:
 *
 *   IFlatten.flatten([[1, 2, 3], [4, 5, 6], [7, 8, 9]]) //=> [1, 2, 3, 4, 5, 6, 7, 8, 9]
 */

IFlatten(Array, { flatten: function flatten(self) {
    return self.reduce(function (acc, xs) {
      return acc.concat(xs);
    }, []);
  }
});

/*
 * Extends IFunctor to work over arrays
 *
 * Example:
 *
 *   IFunctor.map([1,2,3], x => x + 1) //=> [2, 3, 4]
 */

IFunctor(Array, { map: function map(self, f) {
    return self.map(function (x) {
      return curry(f)(x);
    });
  }
});

/*
 * Extends IApply to work over arrays
 *
 * Example:
 *
 *   IApply.ap([x => x * 2, x => x + 3], [1, 2, 3]) // => [2, 4, 6, 4, 5, 6]
 */

IApply(Array, { ap: function ap(self, xs) {
    return IBind.andThen(self, function (f) {
      return IFunctor.map(xs, f);
    });
  }
});

/*
 * Extends IChain to work over arrays
 *
 * Example:
 *
 *   IApply.andThen([1, 2, 3], x => [x, x]) // => [1, 1, 2, 2, 3, 3]
 */

IBind(Array, { andThen: function andThen(self, f) {
    return IFlatten.flatten(IFunctor.map(self, f));
  }
});

/*
 * Extends IAssociative to work over arrays
 *
 * Example:
 *
 *   IAssociative.get([1, 2, 3], 0) // => Some(1)
 *   IAssociative.get([1, 2, 3], 4) // => None
 *
 *   IAssociative.get([1, 2, 3], 0, 10) // => 1
 *   IAssociative.get([1, 2, 3], 4, 10) // => 10
 *
 *   IAssociative.assoc([1, 2, 3], 0, 4) // => [4, 2, 3]
 *
 */

IAssociative(Array, { get: function get(self, key, fallback) {
    return fallback == null ? maybe(self[key]) : getOrElse(maybe(self[key]), fallback);
  },

  assoc: function assoc(self, key, val) {
    return self.map(function (v, idx) {
      return idx === key ? val : v;
    });
  },

  keys: function keys(self) {
    return self.map(function (_, idx) {
      return idx;
    });
  },

  vals: function vals(self) {
    return self;
  }
});

/*
 * Extends IIndexed to work over arrays
 *
 * Example:
 *
 *   IIndexed.nth([1, 2, 3], 0) // => Some(1)
 *   IIndexed.nth([1, 2, 3], 4) // => None
 *   
 *   IAssociative.nth([1, 2, 3], 0, 10) // => 1
 *   IAssociative.nth([1, 2, 3], 4, 10) // => 10
 *
 */

IIndexed(Array, { nth: function nth(self, key, fallback) {
    return fallback == null ? maybe(self[key]) : getOrElse(maybe(self[key]), fallback);
  }
});

/*
 * Extends ICollection to work over arrays
 *
 * Example:
 *
 *   ICollection.first([1, 2, 3]) // => Some(1)
 *   ICollection.first([       ]) // => None()
 *
 *   ICollection.rest ([1, 2, 3]) // => [2, 3]
 *   ICollection.rest ([       ]) // => []
 *
 *   ICollection.conj ([1, 2], 3       ) // => [1, 2, 3]
 *   ICollection.conj ([1, 2], 3, 4    ) // => [1, 2, 3, 4]
 *   ICollection.conj ([[1, 2]], [3, 4]) // => [[1, 2], [3, 4]]
 *
 */

ICollection(Array, { first: function first(self) {
    return IAssociative.get(self, 0);
  },

  rest: function rest(self) {
    return self.slice(1);
  },

  conj: function conj(self) {
    for (var _len = arguments.length, vals = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      vals[_key - 1] = arguments[_key];
    }

    return vals.reduce(function (acc, val) {
      return acc.concat([val]);
    }, self);
  }
});

/*
 * Extends IMonoid to work over Arrays
 *
 *   Example:
 *
 *     empty([1, 2, 3])               // => []
 *     concat([1, 2], [3, 4])         // => [1, 2, 3, 4]
 *     concat([1, 2], [3, 4], [5, 6]) // => [1, 2, 3, 4, 5, 6]
 *
 */

IMonoid(Array, { empty: function empty(self) {
    return [];
  },
  concat: function concat(self) {
    for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      rest[_key2 - 1] = arguments[_key2];
    }

    return self.concat.apply(self, rest);
  }
});

/*
 * Extends IEqual to work over arrays
 *
 * Example:
 *
 *   equals([1,2,3], [1,2,3]) //=> true
 *   equals([1,2,3], [2,3,4]) //=> false
 *   equals([{x:2}], [{x:2}]) //=> true
 */

IEqual(Array, { equals: function equals(self, other) {
    return self.every(function (x, i) {
      return IEqual.equals(x, other[i]);
    });
  }
});

/*
 * Extends IShow to work over arrays
 *
 * Example:
 *
 *   IShow.show([1,2,3]) //=> "[ 1, 2, 3 ]"
 */

IShow(Array, { show: function show(self) {
    return self.length ? "[ " + self.map(IShow.show).join(", ") + " ]" : '[]';
  }
});