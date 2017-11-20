function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

import { Task, Some, None, maybe, fold, andThen } from "../..";

export var set = function set(key, val) {
  return Task(function (fail, succeed) {
    try {
      var str = JSON.stringify(key);
      localStorage.setItem(str);
      succeed(str);
    } catch (ex) {
      fail(ex);
    }
  });
};

export var get = function get(key, fallback) {
  return Task(function (fail, succeed) {
    localStorage[key] == null ? fail("err") : succeed(JSON.parse(localStorage[key]));

    // fallback == null
    //   ? localStorage[key] == null ? fail()            : succeed(JSON.parse(localStorage[key]))
    //   : localStorage[key] == null ? succeed(fallback) : succeed(JSON.parse(localStorage[key]))
  });
};

var __getIn = function __getIn(task, _ref, fallback) {
  var _ref2 = _toArray(_ref),
      k = _ref2[0],
      xs = _ref2.slice(1);

  var get = function get(obj) {
    return fallback == null ? fold(maybe(obj[k]), Task.succeed, Task.fail) : Task.succeed(obj[k] == null ? fallback : obj[k]);
  };

  return xs.length ? __getIn(andThen(task, get), xs, fallback) : andThen(task, get);
};

export var getIn = function getIn(_ref3, fallback) {
  var _ref4 = _toArray(_ref3),
      k = _ref4[0],
      xs = _ref4.slice(1);

  return __getIn(get(k, fallback), xs, fallback);
};

export default { set: set, get: get, getIn: getIn };