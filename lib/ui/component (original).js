function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

import { Type, OneOf, Union, Task, Cursor, cursor, show, flatten, foldl, conj, getIn_, addListener, removeListener, IMMUNE_KEYES_SYM } from "../";

import { h } from "./h";

import AppState from "./app-state";

var validateComponent = function validateComponent(comp, path, fn) {
  if (process.env.NODE_ENV !== "production") {
    if (comp == undefined) throw new TypeError("\nI encountered an error while attempting to mount component at state path: " + show(path) + "\n\n> " + comp + " is not a valid component.\n");

    if (typeof comp[fn] !== "function") throw new TypeError("\nI encountered an error while attempting to mount component at state path: " + show(path) + "\n\n> " + show(comp) + "\n\nIt seems as if it doesn't export a " + fn + " function which all components are required to provide.\n");
  }
};

export var init = function init(comp, path) {
  var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  validateComponent(comp, path, "init");

  console.log("found this:", path);

  var _comp$init = comp.init(props),
      state = _comp$init.state,
      effects = _comp$init.effects;

  AppState.assocIn(path, state);
  executeEffects(comp, effects, path);

  if (!mountedPaths[path.join("-")]) {
    mountedPaths[path.join("-")] = { subscriptions: [] };
    initializeSubscriptions(comp, path);
  }

  return { state: state, effects: effects };
};

export var initFromState = function initFromState(comp, path) {
  var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  validateComponent(comp, path, "init");

  console.log("path:", path);
  console.log(getIn_(APPLICATION_STATE, path));

  // if (!getIn_(APPLICATION_STATE, path))
  //   return init(comp, path, props)
  // 
  // const { state, effects } = comp.init(props)
  // // AppState.update(path, APPLICATION_STATE::getIn_(path))
  // 
  // effects.forEach(eff =>
  //   eff instanceof MountEffect && initFromState(eff.comp, path.concat(eff.path), eff.props)
  // )
  // 
  if (!mountedPaths[path.join("-")]) {
    mountedPaths[path.join("-")] = { subscriptions: [] };
    initializeSubscriptions(comp, path);
  }

  // return { state, effects }
};

export var view = function view(comp, _ref, props) {
  var _ref2 = _toArray(_ref),
      state = _ref2[0],
      path = _ref2.slice(1);

  validateComponent(comp, path, "view");

  var componentCursor = cursor(state, path);
  var componentPath = componentCursor instanceof Cursor ? componentCursor.path : state instanceof Cursor ? state.path.concat(path) : path;

  var update = function update(target) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    validateComponent(comp, componentPath, "update");

    var _comp$update = comp.update(componentCursor, target.apply(undefined, args)),
        nextState = _comp$update.state,
        effects = _comp$update.effects;

    AppState.assocIn(componentPath, nextState);
    executeEffects(comp, effects, componentPath);
  };

  var proxy = {
    get: function get(target, name) {
      if (target && typeof target[name] === "function") {
        return function () {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return update.apply(undefined, [target[name]].concat(args));
        };
      } else {
        if (target == null) throw new TypeError("\nI encountered while dispatching the message " + name + " to component " + show(comp) + " at state path: " + show(path) + "\n\n> The component does not export a Msg type\n");
        if (typeof target[name] !== "function") throw new TypeError("\nI encountered while dispatching the message " + name + " to component " + show(comp) + " at state path: " + show(path) + "\n\n> The Msg type does not define an message called " + name + "\n");
      }
    }
  };

  var actions = process.env.NODE_ENV === "production" ? comp.Msg ? foldl(comp.Msg[IMMUNE_KEYES_SYM], {}, function (acc, msgName) {
    return conj(acc, [msgName, function () {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return update.apply(undefined, [comp.Msg[msgName]].concat(args));
    }]);
  }) : {} : new Proxy(Object.assign({}, comp.Msg), proxy);

  return comp.view(componentCursor, actions, props);
};

export var MountEffect = Type("MountEffect", { comp: Object,
  path: OneOf(String, [OneOf(String, Number)]),
  props: Object
});

var _mount = function _mount(comp, path) {
  var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return MountEffect(comp, path, props);
};

export { _mount as mount };
export var UnmountEffect = Type("UnmountEffect", { comp: Object,
  path: OneOf(String, [OneOf(String, Number)])
});

var _unmount = function _unmount(comp, path) {
  return UnmountEffect(comp, path);
};

export { _unmount as unmount };
export var mountedPaths = {};

export var initializeSubscriptions = function initializeSubscriptions(comp, path) {
  if (typeof comp.subscriptions === "function") {
    var subs = comp.subscriptions(path.join("-"));
    flatten(subs).forEach(function (subscription) {
      var listener = { next: function next(msg) {
          var _comp$update2 = comp.update(cursor(AppState.state, path), msg),
              state = _comp$update2.state,
              effects = _comp$update2.effects;

          AppState.assocIn(path, state);
          executeEffects(comp, effects, path);
          console.log("newState:", AppState.state);
        },
        error: function error(err) {
          throw err;
        }
      };
      addListener(subscription, listener);
      mountedPaths[path.join("-")].subscriptions.push({ subscription: subscription, listener: listener });
    });
  }
};

export var executeEffects = function executeEffects(comp, effects, path) {
  var componentCursor = cursor(AppState.state, path);
  var componentPath = componentCursor.path || path;

  effects.forEach(function (eff) {
    if (eff instanceof MountEffect) {
      var mountPath = componentPath.concat(eff.path);
      if (!mountedPaths[mountPath.join("-")]) {
        mountedPaths[mountPath.join("-")] = { subscriptions: [] };

        var _init = init(eff.comp, mountPath, eff.props),
            state = _init.state,
            _effects = _init.effects;

        initializeSubscriptions(eff.comp, mountPath);
      }
    }

    if (eff instanceof UnmountEffect) {
      var _mountPath = componentPath.concat(eff.path);

      var subscriptions = mountedPaths[_mountPath.join("-")].subscriptions;

      subscriptions.forEach(function (_ref3) {
        var subscription = _ref3.subscription,
            listener = _ref3.listener;
        return removeListener(subscription, listener);
      });

      mountedPaths[_mountPath.join("-")] = undefined;

      AppState.dissocIn(_mountPath);
    }

    if (eff instanceof Task) {
      eff.fork(function () {}, function (msg) {
        if (msg instanceof Union && mountedPaths[componentPath.join("-")]) {
          var _comp$update3 = comp.update(cursor(AppState.state, componentPath), msg),
              _state = _comp$update3.state,
              _effects2 = _comp$update3.effects;

          AppState.assocIn(componentPath, _state);
          executeEffects(comp, _effects2, componentPath);
        }
      });
    }
  });
};

var component = function component(comp) {
  for (var _len4 = arguments.length, path = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    path[_key4 - 1] = arguments[_key4];
  }

  return { mount: function mount() {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return args.length === 1 ? args[0] && args[0].constructor === Object ? _mount(comp, path, args[0]) : _mount(comp, path.concat(args[0]), {}) : _mount(comp, args[0] ? path.concat(args[0]) : path, args[1] || {});
    },
    unmount: function unmount(subPath) {
      return _unmount(comp, path.concat(subPath));
    },
    view: function view(state, subPath) {
      return h(comp, { state: [state].concat(path).concat(subPath) });
    }
  };
};

component.init = init;
component.initFromState = initFromState;
component.view = view;
component.mount = _mount;

export default component;