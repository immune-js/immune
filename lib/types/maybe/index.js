import { Union, caseOf } from "../../utils/union";

import { IEqual, IFlatten, IFunctor, IFoldable, IApply, IBind } from "../../protocols";

import { Any } from "../any";

import { Result } from "../result";

import { curry } from "../function";

export var Maybe = Union("Maybe", { Some: [Any],
  None: []
});

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

Maybe.fromResult = function (result) {
  return caseOf(result, { Ok: function Ok(val) {
      return Maybe.Some(val);
    },
    Err: function Err() {
      return Maybe.None();
    }
  });
};

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

Maybe.toResult = function (maybe, err) {
  return caseOf(maybe, { Some: function Some(val) {
      return Result.Ok(val);
    },
    None: function None() {
      return Result.Err(err);
    }
  });
};

var _Some = Maybe.Some;
export { _Some as Some };
var _None = Maybe.None;

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

export { _None as None };
export var maybe = function maybe(val) {
  return val == null ? _None() : _Some(val);
};

/*
 * Extend protocol IFlatten to work over maybe
 *
 * Example:
 *
 *   flatten(Some(Some(2))) //=> Some(2)
 *   flatten(Some(None( ))) //=> None()
 * 
 */

IFlatten(Maybe, { flatten: function flatten(self) {
    return caseOf(self, { Some: function Some(m) {
        return m;
      }, None: function None() {
        return _None();
      } });
  }
});

/*
 * Extend protocol IFunctor to work over maybe
 *
 * Example:
 *
 *   map(Some(2), x => x + 1) //=> Some(3)
 *   map(None( ), x => x + 1) //=> None()
 * 
 */

IFunctor(Maybe, { map: function map(self, f) {
    return caseOf(self, { Some: function Some(x) {
        return _Some(curry(f)(x));
      }, None: _None });
  }
});

/*
 * Extend protocol IFoldable to work over maybe
 *
 * Example:
 *
 *   fold(Some(2), x => x + 1, () => -1) //=> 3
 *   fold(None( ), x => x + 1, () => -1) //=> -1
 * 
 */

IFoldable(Maybe, { fold: function fold(self, some, none) {
    return caseOf(self, { Some: function Some(val) {
        return typeof some === "function" ? some(val) : some;
      },
      None: function None() {
        return typeof none === "function" ? none() : none;
      }
    });
  }
});

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

IApply(Maybe, { ap: function ap(self, maybe) {
    return IBind.andThen(self, function (fn) {
      return IFunctor.map(maybe, fn);
    });
  }
});

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

IBind(Maybe, { andThen: function andThen(self, f) {
    return IFlatten.flatten(IFunctor.map(self, f));
  }
});

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

IEqual(Maybe, { equals: function equals(self, other) {
    return other != null && other instanceof Maybe && caseOf(self, { Some: function Some(x) {
        return caseOf(other, { Some: function Some(y) {
            return IEqual.equals(x, y);
          },
          None: function None() {
            return false;
          }
        });
      },
      None: function None() {
        return caseOf(other, { Some: function Some() {
            return false;
          },
          None: function None() {
            return true;
          }
        });
      }
    });
  }
});

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

export var getOrElse = function getOrElse(self, fallback) {
  return caseOf(self, { Some: function Some(x) {
      return x;
    }, None: function None() {
      return fallback;
    } });
};