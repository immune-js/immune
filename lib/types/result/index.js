import { Any } from "../any";

import { Union, caseOf } from "../../utils/union";

import { IEqual, IFlatten, IFunctor, IFoldable, IApply, IBind } from "../../protocols";

import { Maybe } from "../maybe";

import { curry } from "../function";

export var Result = Union('Result', { Ok: [Any],
  Err: [Any]
});

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

Result.toMaybe = function (result) {
  return caseOf(result, { Ok: function Ok(val) {
      return Maybe.Some(val);
    },
    Err: function Err() {
      return Maybe.None();
    }
  });
};

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

Result.fromMaybe = function (maybe, err) {
  return caseOf(maybe, { Some: function Some(val) {
      return Result.Ok(val);
    },
    None: function None() {
      return Result.Err(err);
    }
  });
};

var _Ok = Result.Ok;
export { _Ok as Ok };
export var Err = Result.Err;

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

export var result = function result(val, err) {
  return val == null ? Err(err) : _Ok(val);
};

/*
 * Extend protocol IFlatten to work over result
 *
 * Example:
 *
 *   flatten(Ok(Ok(2)))         //=> Ok(2)
 *   flatten(Ok(Err("error!"))) //=> Ok("error!")
 * 
 */

IFlatten(Result, { flatten: function flatten(self) {
    return caseOf(self, { Ok: function Ok(m) {
        return m;
      }, Err: Err });
  }
});

/*
 * Extend protocol IFunctor to work over result
 *
 * Example:
 *
 *   map(Ok(2)         , x => x + 1) //=> Ok(3)
 *   map(Err("error!") , x => x + 1) //=> Err("error")
 * 
 */

IFunctor(Result, { map: function map(self, f) {
    return caseOf(self, { Ok: function Ok(x) {
        return _Ok(curry(f)(x));
      }, Err: Err });
  }
});

/*
 * Extend protocol IFoldable to work over result
 *
 * Example:
 *
 *   fold(Ok(2)        , x => x + 1, err => err + "!!!") //=> 3
 *   fold(Err("error") , x => x + 1, err => err + "!!!") //=> "error!!!"
 * 
 */

IFoldable(Result, { fold: function fold(self, ok, err) {
    return caseOf(self, { Ok: function Ok(val) {
        return typeof ok === "function" ? ok(val) : ok;
      },
      Err: function Err(val) {
        return typeof err === "function" ? err(val) : err;
      }
    });
  }
});

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

IApply(Result, { ap: function ap(self, result) {
    return IBind.andThen(self, function (fn) {
      return IFunctor.map(result, fn);
    });
  }
});

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

IBind(Result, { andThen: function andThen(self, f) {
    return IFlatten.flatten(IFunctor.map(self, f));
  }
});

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

IEqual(Result, { equals: function equals(self, other) {
    return other != null && other instanceof Result && caseOf(self, { Ok: function Ok(x) {
        return caseOf(other, { Ok: function Ok(y) {
            return IEqual.equals(x, y);
          },
          Err: function Err(_) {
            return false;
          }
        });
      },
      Err: function Err(x) {
        return caseOf(other, { Ok: function Ok(_) {
            return false;
          },
          Err: function Err(y) {
            return IEqual.equals(x, y);
          }
        });
      }
    });
  }
});