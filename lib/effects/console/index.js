import { Task } from "../..";

export var table = function table() {
  for (var _len = arguments.length, msgs = Array(_len), _key = 0; _key < _len; _key++) {
    msgs[_key] = arguments[_key];
  }

  return Task(function (_, succeed) {
    var _console;

    return (_console = console).table.apply(_console, msgs), succeed();
  });
};

export var info = function info() {
  for (var _len2 = arguments.length, msgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    msgs[_key2] = arguments[_key2];
  }

  return Task(function (_, succeed) {
    var _console2;

    return (_console2 = console).info.apply(_console2, msgs), succeed();
  });
};

export var log = function log() {
  for (var _len3 = arguments.length, msgs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    msgs[_key3] = arguments[_key3];
  }

  return Task(function (_, succeed) {
    var _console3;

    return (_console3 = console).log.apply(_console3, msgs), succeed();
  });
};

export var warn = function warn() {
  for (var _len4 = arguments.length, msgs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    msgs[_key4] = arguments[_key4];
  }

  return Task(function (_, succeed) {
    var _console4;

    return (_console4 = console).warn.apply(_console4, msgs), succeed();
  });
};

export var error = function error() {
  for (var _len5 = arguments.length, msgs = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    msgs[_key5] = arguments[_key5];
  }

  return Task(function (_, succeed) {
    var _console5;

    return (_console5 = console).error.apply(_console5, msgs), succeed();
  });
};

export default { table: table, log: log, info: info, warn: warn, error: error };