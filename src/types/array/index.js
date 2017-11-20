import
  { IAssociative
  , IIndexed
  , ICollection
  , IMonoid
  , IFunctor
  , IApply
  , IBind
  , IFlatten
  , IEqual
  , IShow
  } from "../../protocols"

import
  { curry
  } from "../function"

import
  { maybe
  , getOrElse
  } from "../maybe"

/*
 * Extends IFlatten to work over arrays
 *
 * Example:
 *
 *   IFlatten.flatten([[1, 2, 3], [4, 5, 6], [7, 8, 9]]) //=> [1, 2, 3, 4, 5, 6, 7, 8, 9]
 */

IFlatten(Array,
  { flatten: (self) => self.reduce((acc, xs) => acc.concat(xs), [])
  }
)


/*
 * Extends IFunctor to work over arrays
 *
 * Example:
 *
 *   IFunctor.map([1,2,3], x => x + 1) //=> [2, 3, 4]
 */

IFunctor(Array,
  { map: (self, f) => self.map(x => curry(f)(x))
  }
)

/*
 * Extends IApply to work over arrays
 *
 * Example:
 *
 *   IApply.ap([x => x * 2, x => x + 3], [1, 2, 3]) // => [2, 4, 6, 4, 5, 6]
 */

IApply(Array,
  { ap: (self, xs) =>
      IBind.andThen(self, f => IFunctor.map(xs, f))
  }
)

/*
 * Extends IChain to work over arrays
 *
 * Example:
 *
 *   IApply.andThen([1, 2, 3], x => [x, x]) // => [1, 1, 2, 2, 3, 3]
 */

IBind(Array,
  { andThen: (self, f) =>
      IFlatten.flatten(IFunctor.map(self, f))
  }
)


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

IAssociative(Array,
  { get: (self, key, fallback) => 
      fallback == null ? maybe(self[key]) : getOrElse(maybe(self[key]), fallback)
      
  , assoc: (self, key, val) =>
      self.map((v, idx) => idx === key ? val : v)
  
  , keys: self =>
      self.map((_, idx) => idx)
  
  , vals: self =>
      self
  }
)

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

IIndexed(Array,
  { nth: (self, key, fallback) => 
      fallback == null ? maybe(self[key]) : getOrElse(maybe(self[key]), fallback)
  }
)

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

ICollection(Array,
  { first: self => 
      IAssociative.get(self, 0)
      
  , rest: self =>
      self.slice(1)
  
  , conj: (self, ...vals) => 
      vals.reduce((acc, val) => acc.concat([val]), self)
  }
)

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

IMonoid(Array,
  { empty  : self            => []
  , concat : (self, ...rest) => self.concat(...rest)
  }
)

/*
 * Extends IEqual to work over arrays
 *
 * Example:
 *
 *   equals([1,2,3], [1,2,3]) //=> true
 *   equals([1,2,3], [2,3,4]) //=> false
 *   equals([{x:2}], [{x:2}]) //=> true
 */

IEqual(Array,
  { equals: (self, other) => 
      self.every((x, i) => IEqual.equals(x, other[i]))
  }
)

/*
 * Extends IShow to work over arrays
 *
 * Example:
 *
 *   IShow.show([1,2,3]) //=> "[ 1, 2, 3 ]"
 */
 
IShow(Array,
  { show: self => 
      self.length ? `[ ${self.map(IShow.show).join(", ")} ]` : '[]'
  }
)