import { Type } from "../../utils/type";

import { IFunctor, IApply, IBind, IFlatten } from "../../protocols";

import { curry, identity } from "../function";

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

export var Task = Type("Task", { fork: Function
});

Task.succeed = function (x) {
  return Task(function (_, succeed) {
    return succeed(x);
  });
};

Task.fail = function (e) {
  return Task(function (fail, _) {
    return fail(e);
  });
};

Task.none = Task(function () {});

Task.of = Task.succeed;

Task.perform = function (task, error, success) {
  return Task(function (_, succeed) {
    return task.fork(function (err) {
      return succeed(err != null ? error(err) : error());
    }, function (val) {
      return succeed(val != null ? success(val) : success());
    });
  });
};

Task.fromPromise = function (p) {
  return Task(function (fail, succeed) {
    return p.then(succeed).catch(fail);
  });
};

Task.toPromise = function (t) {
  return new Promise(function (succeed, fail) {
    return t.fork(fail, succeed);
  });
};

Task.parallel = function (tasks) {
  return Task(function (fail, succeed) {
    return Promise.all(IFunctor.map(tasks, Task.toPromise)).then(succeed).catch(fail);
  });
};

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
Task.tryCatch = function (_try) {
  var _catch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;

  return Task(function (fail, succeed) {
    try {
      succeed(_try());
    } catch (ex) {
      fail(_catch(ex));
    }
  });
};

IFunctor(Task, { map: function map(self, f) {
    return IBind.andThen(self, function (x) {
      return Task.of(curry(f)(x));
    });
  }
});

IApply(Task, { ap: function ap(self, ma) {
    return IBind.andThen(self, function (mb) {
      return IFunctor.map(ma, mb);
    });
  }
});

IBind(Task, { andThen: function andThen(self, f) {
    return Task(function (fail, succeed) {
      return self.fork(fail, function (x) {
        return f(x).fork(fail, succeed);
      });
    });
  }
});

IFlatten(Task, { flatten: function flatten(self) {
    return Task(function (fail, succeed) {
      return self.fork(fail, function (task) {
        return task.fork(fail, succeed);
      });
    });
  }
});