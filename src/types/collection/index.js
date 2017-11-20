import
  { IAssociative
  , IKeyed
  , IIndexed
  , IMonoid
  , IFunctor
  , IBind
  , ICollection
  , IShow
  } from '../../protocols'

import
  { Maybe
  , maybe
  , getOrElse
  } from "../maybe"

import
  { caseOf
  } from '../../utils/union'

import
  { augments
  } from '../../utils/protocol'

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

export const assocIn = (coll, [k, ...ks], value) => {
  return ks.length > 0
    ? caseOf(IAssociative.get(coll, k),
        { Some: x  => IAssociative.assoc(coll, k, assocIn(x, ks, value))
        , None: () => IAssociative.assoc(coll, k, assocIn(IMonoid.empty(coll), ks, value))
        }
      )
    : k == null ? value : IAssociative.assoc(coll, k, value)
}

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

export const dissocIn = (coll, [k, ...ks]) => {
  return ks.length > 0
    ? caseOf(IAssociative.get(coll, k),
        { Some: x  => IAssociative.assoc(coll, k, dissocIn(x, ks))
        , None: () => IAssociative.assoc(coll, k, dissocIn(IMonoid.empty(coll), ks))
        }
      )
    : IKeyed.dissoc(coll, k)
}

/* get_(coll: IAssociative, key: OneOf(String, Number)) => Any
 *
 * Unsafe version of get that doesn't wrap the result in a maybe
 *
 * Example:
 *   
 *   get_({ x: 1, y: 2 }, "x") // => 1
 *   get_({ x: 1, y: 2 }, "z") // => undefined
 */

export const get_ = (coll, key) => 
  caseOf(IAssociative.get(coll, key), { Some: x => x, None: () => undefined})

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

export const getIn = (coll, path, defaultValue) => {
  const res = foldl(path, maybe(coll), (acc, key) => 
    IBind.andThen(acc, coll => 
      augments(coll, IAssociative) 
        ? IAssociative.get(coll,  key) 
        : Maybe.None()
    )
  )
  
  return defaultValue != null
    ? getOrElse(res, defaultValue)
    : res
}

/* getIn_(coll: IAssociative, path: [OneOf(String, Number)]) => Any
 *
 * Unsafe version of getIn that doesn't wrap the result in a maybe
 *
 * Example:
 *   
 *   getIn_({ x: { y: 1 } }, ["x", "y"]) // => 1
 *   getIn_({ x: { y: 1 } }, ["x", "z"]) // => undefined
 */

export const getIn_ = (coll, path) => 
  caseOf(getIn(coll, path), { Some: x => x, None: () => undefined })

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

export const foldl = (coll, acc, f) =>
  caseOf(ICollection.first(coll),
    { Some: val => foldl(ICollection.rest(coll), f(acc, val), f)
    , None: ( ) => acc
    }
  )

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

export const foldr = (coll, acc, f) =>
  caseOf(last(coll),
    { Some: val => foldr(butLast(coll), f(acc, val), f)
    , None: ( ) => acc
    }
  )

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

export const foldValues = (coll, acc, f) =>
  foldl(coll, acc, augments(coll, IIndexed) ? f : (acc, [_, v]) => f(acc, v))

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

export const foldKV = (coll, acc, f) => 
  foldl(IAssociative.keys(coll), acc, (acc, key) => 
    caseOf(IAssociative.get(coll, key), { Some: val => f(acc, [key, val]), None: ( ) => acc})
  )

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

export const mapKV = (coll, f) =>
  foldKV(coll, [], (acc, [k, v]) => ICollection.conj(acc, f([k, v])))

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

export const mapKeys = (coll, f) => 
  mapKV(coll, ([k, _]) => f(k))

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

export const count = xs => 
  foldl(xs, 0, (acc, x) => acc + 1)


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

export const last = xs => {
  const rest = ICollection.rest(xs)
  
  return (count(rest) === 0)
    ? ICollection.first(xs)
    : last(rest)
}


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

export const butLast = xs =>
  (
    function recur(acc, xs) {
      if (count(xs) === 1)
        return acc
      
      return caseOf(ICollection.first(xs),
        { Some: val => recur(ICollection.conj(acc, val), ICollection.rest(xs))
        , None: ( ) => acc
        }
      )
    }
  )(IMonoid.empty(xs), xs)

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

export const filter = (self, f) =>
  typeof(self.filter) === "function"
    ? self.filter(f)
    : foldl(self, IMonoid.empty(self), (acc, v) => f(v) ? ICollection.conj(acc, v) : acc)

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

export const some = (self, f) => 
  typeof(self.some) === "function"
    ? self.some(f)
    : foldl(self, false, (acc, v) => acc || f(v))

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

export const every = (self, f) =>
  typeof(self.every) === "function"
    ? self.every(f)
    : foldl(self, true, (acc, v) => !f(v) ? false : acc)

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

export const find = (coll, predicate) =>
  foldl(coll, Maybe.None(), (acc, val) => 
    caseOf(acc, { Some: x => acc, None: () => predicate(val) ? Maybe.Some(val) : acc })
  )

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

export const into = (from, to) =>
  foldl(from, to, (acc, x) => ICollection.conj(acc, x))


export const mergeDeep = (a, b) =>
  foldl(b, a, (acc, [key, val]) =>
    caseOf(IAssociative.get(acc, key),
      { Some : x  => IAssociative.assoc(acc, key, augments(x, IAssociative) ? mergeDeep(x, val) : val)
      , None : () => IAssociative.assoc(acc, key, val)
      }
    )
  )

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

export const slice = (coll, from = 0, to = count(coll)) => 
  (typeof(coll.slice) === "function")
    ? coll.slice(from, to)
    : into(into(coll, []).slice(from, to), IMonoid.empty(coll))


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
export const join = (coll, separator) =>
  foldValues(coll, "", (acc, val) => {
    const str = (typeof(val) === "string") ? val : IShow.show(val)
    return (acc === "") ? str : acc + separator + str
  })

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

export const sum = coll =>
  foldValues(coll, 0, (a, b) => a + b)


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

export const product = coll =>
  foldValues(coll, 1, (a, b) => a * b)


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

export const avg = coll =>
  sum(coll) / count(coll)
