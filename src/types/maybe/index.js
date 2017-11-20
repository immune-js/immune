import 
  { Union
  , caseOf
  } from "../../utils/union"

import
  { IEqual
  , IFlatten
  , IFunctor
  , IFoldable
  , IApply
  , IBind
  } from "../../protocols"

import 
  { Any
  } from "../any"

import
  { Result
  } from "../result"
  
import
  { curry
  } from "../function"


export const Maybe = Union("Maybe",
  { Some : [Any]
  , None : []
  }
)

/*
 * Maybe.fromResult(result: Result(Any, Any)) => Maybe(Any)
 *
 * Transforms a result into a maybe
 *
 * Example:
 *
 *   Maybe.fromResult(Ok(2))      // => Some(2)
 *   Maybe.fromResult(Err("err")) // => None( )
 */

Maybe.fromResult = result =>
  caseOf(result,
    { Ok  : val => Maybe.Some(val)
    , Err : ( ) => Maybe.None() 
    }
  )

/*
 * Maybe.toResult(result: Maybe(Any), err: any) => Result(Any, Any)
 *
 * Transforms a maybe into a result
 *
 * Example:
 *
 *   Maybe.toResult(Some(2), "err")  // => Ok(2)
 *   Maybe.toResult(None( ), "err")  // => Err("err")
 */

Maybe.toResult = (maybe, err) =>
  caseOf(maybe,
    { Some : val => Result.Ok  (val)
    , None : ( ) => Result.Err (err)
    }
  )

export const Some = Maybe.Some
export const None = Maybe.None

/*
 * maybe(val: Any) => Maybe
 *
 * Wraps a value in a Some unless it's null or undefined in wich case it returns None
 *
 * Example:
 *
 *   maybe( 123       ) //=> Some(123)
 *   maybe( "2"       ) //=> Some("2")
 *   maybe( null      ) //=> None()
 *   maybe( undefined ) //=> None()
 *
 */

export const maybe = val =>
  val == null ? None() : Some(val)

/*
 * Extend protocol IFlatten to work over maybe
 *
 * Example:
 *
 *   flatten(Some(Some(2))) //=> Some(2)
 *   flatten(Some(None( ))) //=> None()
 * 
 */

IFlatten(Maybe,
  { flatten: self =>
      caseOf(self, { Some: m => m, None: () => None() })
  }
)


/*
 * Extend protocol IFunctor to work over maybe
 *
 * Example:
 *
 *   map(Some(2), x => x + 1) //=> Some(3)
 *   map(None( ), x => x + 1) //=> None()
 * 
 */

IFunctor(Maybe,
  { map: (self, f) =>
      caseOf(self, { Some: x => Some(curry(f)(x)), None })
  }
)

/*
 * Extend protocol IFoldable to work over maybe
 *
 * Example:
 *
 *   fold(Some(2), x => x + 1, () => -1) //=> 3
 *   fold(None( ), x => x + 1, () => -1) //=> -1
 * 
 */

IFoldable(Maybe,
  { fold: (self, some, none) =>
      caseOf(self, 
        { Some: val => typeof(some) === "function" ? some(val) : some
        , None: ( ) => typeof(none) === "function" ? none(   ) : none 
        }
      )
  }
)

/*
 * Extend protocol IApply to work over maybe
 *
 * Example:
 * 
 *   ap(Some(x => x + 2), Some(4))      // => Some(6)
 *   ap(None()          , Ok(4)  )      // => Err("error!")
 *   ap(Some(x => x + 2), Err("error")) // => Err("error!")
 * 
 */

IApply(Maybe,
  { ap: (self, maybe) =>
      IBind.andThen(self, fn => IFunctor.map(maybe, fn))
  }
)

/*
 * Extend protocol IBind to work over maybe
 *
 * Example:
 *
 *   andThen(Some(2), x => Some(x + 1)) //=> Some(3)
 *   andThen(Some(2), x => None(     )) //=> None()
 *   andThen(None( ), x => Some(x + 1)) //=> None()
 * 
 */

IBind(Maybe,
  { andThen: (self, f) =>
      IFlatten.flatten(IFunctor.map(self, f))
  }
)

/*
 * Extend protocol IEqual to work over maybe
 *
 * Example:
 *
 *   equals(Some(2), Some(2)) //=> true
 *   equals(Some(2), Some(4)) //=> false
 *   equals(Some(2), 2      ) //=> false
 *   equals(Some(2), None() ) //=> false
 */

IEqual(Maybe,
  { equals: (self, other) =>
      other != null && other instanceof Maybe && caseOf(self,
        { Some: x  => caseOf(other, 
            { Some: y  => IEqual.equals(x, y)
            , None: () => false 
            }
          )
        , None: () => caseOf(other,
            { Some : () => false
            , None : () => true
            }
          )
        }
      )
  }
)


/*
 * getOrElse(self: Maybe(Any), fallback: Any) => Any
 *
 * Attempts to extract the value from a Maybe, returns fallback otherwise
 *
 * Example:
 * 
 *   Some(2).getOrElse(0)    //=> 2
 *   None( ).getOrElse(0)    //=> 0
 */
 
export const getOrElse = (self, fallback) => 
  caseOf(self, { Some: x => x, None: () => fallback })