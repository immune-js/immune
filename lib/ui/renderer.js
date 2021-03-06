var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import nanoid from "nanoid";

import { patch } from "picodom";

import { Component, MountComponent, UnmountComponent, AsyncComponent } from "./component";

import { IMMUNE_KEYES_SYM } from "../..";

import { Task, Union, None, fold, foldl, conj, getIn, getIn_, assocIn, constant } from "../";

import h from "./h";
import hydrate from "./hydrate";
import AppState from "./app-state";

var viewActions = function viewActions(component, path, state) {
  if (!component.Msg) return {};
  if (process.env.NODE_ENV !== "production") {
    var proxy = {
      get: function get(target, name) {
        if (target && typeof target[name] === "function") {
          return function () {
            var update = component.update(state, target[name].apply(target, arguments), None());
            AppState.assocIn(path, update.state);
            executeEffects(component, update.effects, path, update.state);
          };
        } else {
          if (target == null) throw InvalidDispatch("The component does not export a Msg type");
          if (typeof target[name] !== "function") throw InvalidDispatch("The Msg type does not define an message called " + name);
        }
      }
    };

    return new Proxy(Object.assign({}, component.Msg), proxy);
  } else {
    var actions = foldl(component.Msg[IMMUNE_KEYES_SYM], {}, function (acc, msgName) {
      return conj(acc, [msgName, function () {
        var _component$Msg;

        var update = component.update(getIn_(AppState.state, path), (_component$Msg = component.Msg)[msgName].apply(_component$Msg, arguments), None());
        AppState.assocIn(path, update.state);
        executeEffects(component, update.effects, path, update.state);
      }]);
    });

    return actions;
  }
};

var executeEffects = function executeEffects(component, effects, path, state) {
  effects.forEach(function (eff) {
    var task = eff instanceof Union ? Task.of(eff) : eff;

    if (task === Task.none) return;

    task.fork(function (err) {
      return console.error(err);
    }, function (msg) {
      if (msg == null) return;

      if (msg instanceof MountComponent) return AppState.assocIn(path, assocIn(state, msg.path, undefined));

      if (msg instanceof UnmountComponent) return unmountComponent(path.concat(msg.path));

      var _component$update = component.update(state, msg, None()),
          updateState = _component$update.state,
          updateEffects = _component$update.effects;

      AppState.assocIn(path, updateState);

      if (updateEffects.length) executeEffects(component, updateEffects, path, updateState);
    });
  });
};

var mountedComponents = {};

var mountComponent = function mountComponent(component, path) {
  var subscriptions = [];

  if (typeof component.subscriptions === "function") {
    subscriptions = component.subscriptions().map(function (subscription) {
      var listener = { next: function next(msg) {
          return executeEffects(component, [Task.of(msg)], path, getIn_(AppState.state, path));
        },
        error: function error(err) {
          return console.error(err);
        }
      };

      subscription.addListener(listener);
      return function () {
        return subscription.removeListener(listener);
      };
    });
  }

  var componentData = { component: component, subscriptions: subscriptions, key: nanoid() };

  mountedComponents[path.join("-")] = componentData;

  return componentData;
};

var unmountComponent = function unmountComponent(path) {
  var pathKey = path.join("-");
  var _mountedComponents$pa = mountedComponents[pathKey],
      component = _mountedComponents$pa.component,
      subscriptions = _mountedComponents$pa.subscriptions;


  subscriptions.forEach(function (removeListener) {
    return removeListener();
  });

  delete mountedComponents[pathKey];

  AppState.dissocIn(path);
};

var isMounted = function isMounted(path) {
  return !!mountedComponents[path.join("-")];
};

var resolvedPaths = {};

export var renderView = function renderView(component, state, path, props) {
  var key = mountedComponents[path.join("-")].key;


  var view = component.view({ state: state,
    actions: viewActions(component, path, state),
    props: props
  });

  view.data.key = view.data.key || key;

  var oldOnCreate = view.data.oncreate;

  view.data.oncreate = function () {
    if (typeof component.mount === "function") {
      var _component$mount = component.mount(state, None()),
          mountState = _component$mount.state,
          mountEffects = _component$mount.effects;

      AppState.assocIn(path, mountState);
      executeEffects(component, mountEffects, path, mountState);
    }

    if (typeof oldOnCreate === "function") return oldOnCreate.apply(undefined, arguments);
  };

  return view;
};

var traverse = function traverse(comp, path, state) {
  if (comp instanceof AsyncComponent) {
    var resolvedComp = resolvedPaths[path.concat(comp.path).join("-")];

    if (!resolvedComp) {
      var res = comp.component.fork(function () {}, function (asyncComp) {
        resolvedPaths[path.concat(comp.path).join("-")] = { comp: asyncComp["default"], props: comp.props.props };
        AppState.update(function (state) {
          return state;
        });
      });

      return typeof comp.props.loader == "function" ? comp.props.loader() : comp.props.loader == null ? { tag: null, data: {}, children: [] } : comp.props.loader;
    }

    comp = resolvedComp.comp((path[0] === "application" ? path.slice(1, path.length) : path).concat(comp.path), resolvedComp.props);
  }

  if (comp instanceof Component) {
    var componentPath = path.concat(comp.path);
    var componentState = getIn(state, componentPath);
    var props = _extends({ context: None() }, comp.props);

    var view = fold(componentState, function (state) {
      if (!isMounted(componentPath)) mountComponent(comp.component, componentPath);

      return renderView(comp.component, state, componentPath, props);
    }, function () {
      var _comp$component$init = comp.component.init(props),
          initState = _comp$component$init.state,
          initEffects = _comp$component$init.effects;

      AppState.assocIn(componentPath, initState);

      mountComponent(comp.component, componentPath);

      initEffects.length && executeEffects(comp.component, initEffects, componentPath, initState);

      return renderView(comp.component, initState, componentPath, props);
    });

    return traverse(view, path.concat(comp.path || []), state);
  }

  if (typeof comp === "string" || typeof comp === "number") return comp.toString();

  return { tag: comp.tag,
    data: comp.data,
    children: comp.children.map(function (child) {
      return traverse(child, path.concat(comp.path || []), state);
    })
  };
};

var isRendering = false;

export default (function (target) {
  var _hydrate = hydrate(target),
      element = _hydrate.element,
      oldNode = _hydrate.oldNode;

  var render = function render(state, comp) {
    var domTree = traverse(comp, [], state);

    if (!isRendering) {
      isRendering = true;
      requestAnimationFrame(function () {
        console.log("rendering...");
        element = patch(oldNode, oldNode = domTree, element, target);
        isRendering = false;
      });
    }
  };

  return render;
});