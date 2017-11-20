import
  { Any
  } from "../any"

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
  { Maybe
  } from "../maybe"
  
import
  { curry
  } from "../function"

export const Result = Union('Result',
  { Ok  : [ Any ]
  , Err : [ Any ]
  }
)

/*
 * Result.toMaybe(result: Result(Any, Any)) => Maybe(Any)
 * 
 * Transforms a result into a maybe
 *
 * Example:
 *
 *   Result.toMaybe(Ok(2))        // => Some(2)
 *   Result.toMaybe(Err("err"))   // => None( )
 *
 */

Result.toMaybe = result => 
  caseOf(result,
    { Ok  : val => Maybe.Some(val)
    , Err : ( ) => Maybe.None(   )
    }
  )

/*
 * Result.fromMaybe(maybe: Maybe(Any), err: Any) => Result(Any, Any)
 * 
 * Transforms a result into a maybe
 *
 * Example:
 *
 *   Result.fromMaybe(Some(2), "err")  // => Ok(2)
 *   Result.fromMaybe(None( ), "err")  // => Err("err")
 *
 */

Result.fromMaybe = (maybe, err) =>
  caseOf(maybe,
    { Some : val => Result.Ok  (val)
    , None : ( ) => Result.Err (err)
    }
  )

export const Ok  = Result.Ok
export const Err = Result.Err

/*
 * result(val: Any, err: Any) => Result(Any, Any)
 *
 * Wraps a value in a Ok unless it's null or undefined in wich case it returns Err with the provided err case 
 *
 * Example:
 *
 *   result( 123       , "error!") //=> Ok(123)
 *   result( "2"       , "error!") //=> Ok("2")
 *   result( null      , "error!") //=> Err("error!")
 *   result( undefined , "error!") //=> Err("error!")
 *
 */

export const result = (val, err) =>
  val == null ? Err(err) : Ok(val)

/*
 * Extend protocol IFlatten to work over result
 *
 * Example:
 *
 *   flatten(Ok(Ok(2)))         //=> Ok(2)
 *   flatten(Ok(Err("error!"))) //=> Ok("error!")
 * 
 */

IFlatten(Result,
  { flatten: self =>
      caseOf(self, { Ok: m => m, Err })
  }
)


/*
 * Extend protocol IFunctor to work over result
 *
 * Example:
 *
 *   map(Ok(2)         , x => x + 1) //=> Ok(3)
 *   map(Err("error!") , x => x + 1) //=> Err("error")
 * 
 */

IFunctor(Result,
  { map: (self, f) =>
      caseOf(self, { Ok: x => Ok(curry(f)(x)), Err })
  }
)

/*
 * Extend protocol IFoldable to work over result
 *
 * Example:
 *
 *   fold(Ok(2)        , x => x + 1, err => err + "!!!") //=> 3
 *   fold(Err("error") , x => x + 1, err => err + "!!!") //=> "error!!!"
 * 
 */

IFoldable(Result,
  { fold: (self, ok, err) =>
      caseOf(self, 
        { Ok  : val => typeof(ok ) === "function" ? ok  (val) : ok
        , Err : val => typeof(err) === "function" ? err (val) : err 
        }  
      )
  }
)

/*
 * Extend protocol IApply to work over result
 *
 * Example:
 *
 *   ap(Ok(x => x + 2), Ok(4))        // => Ok(6)
 *   ap(Err("error!") , Ok(4))        // => Err("error!")
 *   ap(Ok(x => x + 2), Err("error")) // => Err("error!")
 * 
 */

IApply(Result,
  { ap: (self, result) =>
      IBind.andThen(self, fn => IFunctor.map(result, fn))
  }
)

/*
 * Extend protocol IBind to work over result
 *
 * Example:
 *
 *   andThen(Ok  (2       ), x => Ok  (x + 1   )) //=> Ok  (3       )
 *   andThen(Ok  (2       ), x => Err ("error!")) //=> Err ("error!")
 *   andThen(Err ("error!"), x => Ok  (x + 1   )) //=> Err ("error!")
 * 
 */

IBind(Result,
  { andThen: (self, f) =>
      IFlatten.flatten(IFunctor.map(self, f))
  }
)

/*
 * Extend protocol IEqual to work over result
 *
 * Example:
 *
 *   equals(Ok(2), Ok(2)        ) //=> true
 *   equals(Ok(2), Ok(4)        ) //=> false
 *   equals(Ok(2), 2            ) //=> false
 *   equals(Ok(2), Err("error!")) //=> false
 */

IEqual(Result,
  { equals: (self, other) =>
      other != null && other instanceof Result && caseOf(self,
        { Ok: x => caseOf(other, 
            { Ok  : y => IEqual.equals(x, y)
            , Err : _ => false
            }
          )
        , Err: x => caseOf(other,
            { Ok  : _ => false
            , Err : y => IEqual.equals(x, y)
            }
          )
        }
      )
  }
)
