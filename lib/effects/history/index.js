import createHistory from "history/createBrowserHistory";
import { createLocation } from "../location";

import { Task, Stream, startWith, map, dropRepeats, slice, split, conj, foldl, equals } from "../..";

var history = void 0;

export var listen = function listen(msg, config) {
  history = history || createHistory(config || {});

  var unlisten = void 0;

  return map(dropRepeats(startWith(Stream.create({ start: function start(listener) {
      return unlisten = history.listen(function (loc) {
        return listener.next(loc);
      });
    },

    stop: function stop() {
      return unlisten();
    }
  }), history.location), compareUrls), function (loc) {
    return msg(toLocation(loc));
  });
};

export var push = function push(path) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Task(function (_, succeed) {
    return stringifyLocation(history.location) !== path && history.push(path, context), succeed();
  });
};

export var replace = function replace(path) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Task(function (_, succeed) {
    return history.replace(path, context), succeed();
  });
};

export var forward = function forward() {
  return Task(function (_, succeed) {
    return history.forward(), succeed();
  });
};

export var back = function back() {
  return Task(function (_, succeed) {
    return history.back(), succeed();
  });
};

//******************************************************************************
// Utils
//******************************************************************************

export var toLocation = function toLocation(_ref) {
  var pathname = _ref.pathname,
      search = _ref.search,
      _ref$params = _ref.params,
      params = _ref$params === undefined ? {} : _ref$params,
      hash = _ref.hash;

  return createLocation(pathname, search, params, hash);
};

var stringifyLocation = function stringifyLocation(loc) {
  return "" + loc.pathname + loc.search + loc.hash;
};

var compareUrls = function compareUrls(prev, next) {
  return stringifyLocation(prev) === stringifyLocation(next) && equals(prev.state || {}, next.state || {});
};

export default { listen: listen, push: push, replace: replace, forward: forward, back: back, toLocation: toLocation };