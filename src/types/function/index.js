import 
  { IShow
  , IFunctor
  , IApply
  } from '../../protocols'

import
  { Task 
  } from "../task"

/*
 * Extends IShow to work over functions
 *
 * Example:
 *
 *   IShow.show(function Foo (a, b) { return a + b }) //=> "function Foo (a, b) { ... }"
 */
 
IShow(Function,
  { show: self => self.toString().replace(/\{(.|\n)*/, '{ ... }')
  }
)

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

export const identity = x => x

/*
 * constant(x: Any) => Function
 * 
 * Example:
 *   
 *   constant(  2  )([1, 2]) // => 2
 *   constant("foo")(  23  ) // => 2
 */

export const constant = x => y => x

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

export const compose = (f, ...fns) => 
  fns.reduce((acc, fn) => (...args) => acc(fn(...args)), f)


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

IFunctor(Function,
  { map: compose
  }
)

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

export const lift = (fn, arg, ...args) =>
  (arg instanceof Task) 
    ? IFunctor.map(Task.parallel([arg, ...args]), results => f(...results))
    : args.reduce(IApply.ap, IFunctor.map(arg, fn))

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

const ImmuneCurrySym = Symbol("@@__IMMUNE_CURRIED__")

export const curry = function (f, n) {
  let arity = typeof (n) !== "undefined" ? n : f.length
    , name  = f.name

  if ( f[ImmuneCurrySym] ) return f
  if ( arity < 2         ) return f

  const curriedFn = function () {
    let args      = [].slice.call(arguments, 0, arity)
      , realArity = args.length
      , self      = this

    if (realArity >= arity)
      return f.apply(self, arguments)
    else {
      const g = function () {
        let partialArgs = [].slice.call(arguments)
          , newArgs     = []

        for (let i = 0; i < args.length; i++)
          newArgs[i] = args[i]

        return curriedFn.apply(self, newArgs.concat(partialArgs))
      }

      g.toString = curriedFn.toString.bind(curriedFn)

      return g
    }
  }
  
  curriedFn[ImmuneCurrySym] = true
  curriedFn.toString = f.toString.bind(f)

  return curriedFn
}