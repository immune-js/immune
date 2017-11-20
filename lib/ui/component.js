var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

import { Type, Task, getIn, map } from "../";

import nanoid from "nanoid";
import format from "nanoid/format";
import url from "nanoid/url";

export var Component = Type("Component", { component: { init: Function, view: Function },
  path: Array,
  props: Object
});

export var MountComponent = Type("MountComponent", { path: Array });
export var UnmountComponent = Type("UnmountComponent", { path: Array });

export var step = function step(state) {
  var effects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return { state: state, effects: effects };
};

export default (function (comp) {
  var instance = function instance(path) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return Component(comp, Array.isArray(path) ? path : [path], props);
  };

  instance.dynamic = function (_ref, f) {
    var _ref2 = _toArray(_ref),
        state = _ref2[0],
        path = _ref2.slice(1);

    return map(getIn(state, path, []), function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          _ = _ref4[1];

      var el = f(key, function () {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return instance(path.concat(key), props);
      });

      if (!el.data.key) el.data.key = key;

      return el;
    });
  };

  instance.mount = function (path, id) {
    return Task(function (fail, succeed) {
      return succeed(MountComponent((Array.isArray(path) ? path : [path]).concat(id == null ? format(nanoid, "abcdefghijklmnopqrstuvwxyz", 10) : id.toString())));
    });
  };

  instance.unmount = function (path) {
    return Task(function (fail, succeed) {
      return succeed(UnmountComponent(Array.isArray(path) ? path : [path]));
    });
  };

  return instance;
});