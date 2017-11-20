function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import { IShow, IFunctor, IApply } from '../../protocols';

import { Task } from "../task";

/*
 * Extends IShow to work over functions
 *
 * Example:
 *
 *   IShow.show(function Foo (a, b) { return a + b }) //=> "function Foo (a, b) { ... }"
 */

IShow(Function, { show: function show(self) {
    return self.toString().replace(/\{(.|\n)*/, '{ ... }');
  }
});

/*
 * identity(x: Any) => Any
 *
 * A function that always returns the value it's given
 * 
 * Example:
 *   
 *   identity(2)       // => 2
 *   identity("foo")   // => 2
 */

export var identity = function identity(x) {
  return x;
};

/*
 * constant(x: Any) => Function
 * 
 * Example:
 *   
 *   constant(  2  )([1, 2]) // => 2
 *   constant("foo")(  23  ) // => 2
 */

export var constant = function constant(x) {
  return function (y) {
    return x;
  };
};

/*
 * compose(f: Function, ...fns: [Function]) => Function
 *
 * Returns a new function that when called with a value will apply it to 
 * the last function in the list and then apply the result of that to the next one, and so on.
 *
 * Example:
 *
 *   const f = x => concat(x, "!")
 *   const g = x => show(x)
 *   const x = 2
 *   
 *   compose(f, g)(x)              // => '2!'
 *   compose(f, g)(x) === f(g(x))  // => true
 */

export var compose = function compose(f) {
  for (var _len = arguments.length, fns = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    fns[_key - 1] = arguments[_key];
  }

  return fns.reduce(function (acc, fn) {
    return function () {
      return acc(fn.apply(undefined, arguments));
    };
  }, f);
};

/*
 * Extend IFunctor to work over functions
 *
 * Example:
 *
 *   const f = x => concat(x, "!")
 *   const g = x => show(x)
 *   const x = 2
 *   
 *   map(f, g)(x)              // => '2!'
 *   map(f, g)(x) === f(g(x))  // => true
 *
 */

IFunctor(Function, { map: compose
});

/*
 * lift(fn: Function, ...args: [IApply]) => IApply(Any)
 *
 * Turns a regular function into a function that can operate on applicative contexts.
 * When used with tasks as arguments each task will be run in paralell.
 *
 * Example:
 * 
 *   const add = (a, b) => a + b
 *
 *   lift(add, Some(1), Some(2)) //=> Some(3)
 *   lift(add, Some(1), None( )) //=> None( )
 *   lift(add, [1, 2], [3, 4])   // => [ 4 ,  5 ,  5 ,  6  ]
 *                               //     ^^^  ^^^  ^^^  ^^^
 *                               //     1+3  1+4  2+3  2+4
 *   lift(add, [1, 2], [])       // => []
 */

export var lift = function lift(fn, arg) {
  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  return arg instanceof Task ? IFunctor.map(Task.parallel([arg].concat(args)), function (results) {
    return f.apply(undefined, _toConsumableArray(results));
  }) : args.reduce(IApply.ap, IFunctor.map(arg, fn));
};

/*
 * curry(f: Function, arity: Number) => Function
 *
 * Given any fixed arity function it returns a new function that can be partially applied.
 *
 * Usage:
 *
 *   const times    = curry((a, b) => a * b)
 *   const timesTwo = times(2)
 *
 *   timesTwo(4) //=> 8
 *   times(2, 4) //=> 8
 *   times(2)(4) //=> 8
 */

var ImmuneCurrySym = Symbol("@@__IMMUNE_CURRIED__");

export var curry = function curry(f, n) {
  var arity = typeof n !== "undefined" ? n : f.length,
      name = f.name;

  if (f[ImmuneCurrySym]) return f;
  if (arity < 2) return f;

  var curriedFn = function curriedFn() {
    var args = [].slice.call(arguments, 0, arity),
        realArity = args.length,
        self = this;

    if (realArity >= arity) return f.apply(self, arguments);else {
      var g = function g() {
        var partialArgs = [].slice.call(arguments),
            newArgs = [];

        for (var i = 0; i < args.length; i++) {
          newArgs[i] = args[i];
        }return curriedFn.apply(self, newArgs.concat(partialArgs));
      };

      g.toString = curriedFn.toString.bind(curriedFn);

      return g;
    }
  };

  curriedFn[ImmuneCurrySym] = true;
  curriedFn.toString = f.toString.bind(f);

  return curriedFn;
};