import
  { Type
  } from "../../utils/type"

import
  { IFunctor
  , IApply
  , IBind
  , IFlatten
  } from "../../protocols"

import
  { curry
  , identity
  } from "../function"

/* Task(fork: Function)
 * 
 * Like a promise but pure, meaning it will not execute until fork is called.
 *
 * Example:
 * 
 *   // Create the task
 *   const delayedTask = Task((fail, succeed) => setTimeout(succeed("hello!"), 1000))
 *
 *   // Transform the eventual result
 *   const transformedTask = andThen(map(delayedTask, x => x + '!'), x => Task.of(x + ' Task!!'))
 * 
 *   // Actually execute the task
 *   transformedTask.fork(
 *     err => console.log("err:", err)
 *     val => console.log("val:", val)
 *   ) // => *** waits 1 second ***
 *     // => "hello!! Task!!"
 */

export const Task = Type("Task", 
  { fork: Function 
  }
)

Task.succeed = x =>
  Task((_, succeed) => succeed(x))

Task.fail = e =>
  Task((fail, _) => fail(e))

Task.none = Task(() => {})

Task.of = Task.succeed

Task.perform = (task, error, success) =>
  Task((_, succeed) =>
    task.fork(
      err => succeed(err != null ? error   (err) : error   ()), 
      val => succeed(val != null ? success (val) : success ()),
    )
  )

Task.fromPromise = p =>
  Task((fail, succeed) => p.then(succeed).catch(fail))


Task.toPromise = t =>
  new Promise((succeed, fail) => t.fork(fail, succeed))

Task.parallel = tasks =>
  Task((fail, succeed) => Promise.all(IFunctor.map(tasks, Task.toPromise)).then(succeed).catch(fail))

/*
 * Task.tryCatch(try: Function, catch: Function) => Task(Any)
 *
 * Attempts to execute the 'try' function, if it throws an exception then it 
 * calls the 'catch' function with the error.
 *
 * Task.tryCatch(
 *   ( ) => 1 + 1, 
 *   err => err.toString()
 * ) //=> Task.succeed(2)
 *
 * Task.tryCatch(
 *   ( ) => { throw new Error("error") },
 *   err => err.toString()
 * ) //=> Task.fail("Error: error!")
 *
 */
Task.tryCatch = (_try, _catch = identity) =>
  Task((fail, succeed) => { try { succeed(_try()) } catch (ex) { fail(_catch(ex)) } })


IFunctor(Task,
  { map: (self, f) => 
      IBind.andThen(self, x => Task.of(curry(f)(x)))
  }
)

IApply(Task,
  { ap: (self, ma) => 
      IBind.andThen(self, mb => IFunctor.map(ma, mb))
  }
)

IBind(Task,
  { andThen: (self, f) => 
      Task((fail, succeed) =>
        self.fork(fail, x => f(x).fork(fail, succeed))
      )
  }
)

IFlatten(Task,
  { flatten: self =>
      Task((fail, succeed) => self.fork(fail, task => task.fork(fail, succeed)) )
  }
)
