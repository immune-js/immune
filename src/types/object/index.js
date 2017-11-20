import
  { IAssociative
  , IKeyed
  , ICollection
  , IMonoid
  , IFunctor
  , IFoldable
  , IShow
  , IEqual
  } from "../../protocols"

import
  { curry
  } from "../function"

import
  { caseOf
  } from "../../utils/union"

import
  { Some
  , None
  , maybe
  , getOrElse
  } from "../maybe"

import
  { foldl
  } from "../collection"


/*
 * Extends IFunctor to work over objects
 *
 * Example:
 *
 *   IFunctor.map({ x: 1, y: 2 }, x => x + 1) //=> [2, 3]
 */

IFunctor(Object,
  { map: (self, f) =>
      Object.keys(self).map(key => curry(f)([key, self[key]]))
  }
)

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

IAssociative(Object,
  { assoc: (self, key, val) => (
      { ...self, [key]: val }
    )
    
  , get: (self, key, defaultValue) =>
      defaultValue == null ? maybe(self[key]) : getOrElse(maybe(self[key]), defaultValue)
  
  , keys: self =>
      Object.keys(self)
  
  , vals: self =>
      IAssociative.keys(self).map(k => self[k])
  }
)

/*
 * Extends IKeyed to work over objects
 *
 * Example:
 *
 *   IKeyed.dissoc ({ x: 1, y: 2, z: 3 }, "y")  // => { x: 1, z: 3 }
 *
 */

IKeyed(Object, 
  { dissoc: (self, k) =>
      Object.keys(self)
        .filter(   key     => key !== k)
        .reduce((acc, key) => (acc[key] = self[key], acc), {})
  }
)

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
 
ICollection(Object,
  { first: self =>
      caseOf(IAssociative.get(Object.keys(self), 0),
        { Some: key => Some([key, self[key]])
        , None: ( ) => None()
        }
      )
  
  , rest: self =>
      Object.keys(self).slice(1).reduce((acc, key) => ({ ...acc, [key]: self[key] }), {})
  
  , conj: (self, ...entries) =>
      entries.reduce((acc, entry) => {
        if (Array.isArray(entry)) {
          const [k, v] = entry
          return Object.assign(acc, { [k]: v })
        } 
        if (entry && entry.constructor) {
          return Object.assign(acc, entry)
        }
      }, Object.assign({}, self))
  }
)

/*
 * Extends IMonoid to work over Objects
 *
 *   Example:
 *
 *     empty({ x: 1, y: 2 })      // => {}
 *     concat({ x: 1 }, { y: 2 }) // => { x: 1, y: 2 }
 *
 */

IMonoid(Object,
  { empty  : self            => ({})
  , concat : (self, ...rest) => Object.assign({}, self, ...rest)
  }
)

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

IEqual(Object,
  { equals: (self, other) =>
      Object.keys(self).every(key => IEqual.equals(self[key], other[key]))
  }
)

/*
 * Extends IShow to work over objects
 *
 * Example:
 *
 *   IShow.show({ x: 1, y: 2 }) //=> "{ x: 1, y: 2 }"
 */

IShow(Object,
  { show: self => 
      `{ ${Object.keys(self).map(key => `${key}: ${IShow.show(self[key])}`).join(", ")} }`
  }
)


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
 
export const evolve = (object, transformations) =>
  foldl(transformations, object, (acc, [key, transformation]) =>
    IAssociative.assoc(acc, key,
      typeof(transformation) === "function"
        ? transformation(IAssociative.get(object, key))
        : transformation && transformation.constructor === Object
        ? IFoldable.fold(IAssociative.get(object, key), 
            obj => obj.constructor === Object ? evolve(obj, transformation) : evolve(Array.isArray(obj) ? [] : {}, transformation), 
            ( ) => evolve({}, transformation)
          )
        : transformation
    )
  )