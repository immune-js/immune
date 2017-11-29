import createHistory from "history/createBrowserHistory";
import { createLocation } from "../location";

import { Task, Stream, startWith, map, dropRepeats, slice, split, conj, foldl, equals } from "../..";

var history = void 0;

var _createHistory = function _createHistory() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return history = history || createHistory(config || {});
};

export var listen = function listen(msg, config) {
  _createHistory(config);

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

export var location = Task(function (_, succeed) {
  _createHistory();
  succeed(toLocation(history.location));
});

export var push = function push(path) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Task(function (_, succeed) {
    _createHistory();
    stringifyLocation(history.location) !== path && history.push(path, context);
    succeed();
  });
};

export var replace = function replace(path) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Task(function (_, succeed) {
    _createHistory();
    history.replace(path, context);
    succeed();
  });
};

export var forward = function forward() {
  return Task(function (_, succeed) {
    _createHistory();
    history.forward();
    succeed();
  });
};

export var back = function back() {
  return Task(function (_, succeed) {
    _createHistory();
    history.back();
    succeed();
  });
};

//******************************************************************************
// Utils
//******************************************************************************

export var toLocation = function toLocation(_ref) {
  var pathname = _ref.pathname,
      search = _ref.search,
      hash = _ref.hash;

  return createLocation(pathname, search, {}, hash);
};

var stringifyLocation = function stringifyLocation(loc) {
  return "" + loc.pathname + loc.search + loc.hash;
};

var compareUrls = function compareUrls(prev, next) {
  return stringifyLocation(prev) === stringifyLocation(next) && equals(prev.state || {}, next.state || {});
};

export default { listen: listen, location: location, push: push, replace: replace, forward: forward, back: back, toLocation: toLocation };