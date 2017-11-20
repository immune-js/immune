var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { patch } from "picodom";

import { Component, MountComponent, UnmountComponent } from "./component";

import { IMMUNE_KEYES_SYM } from "../..";

import { Task, None, fold, foldl, conj, getIn, getIn_, assocIn, constant } from "../";

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
    eff.fork(function (err) {
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

  mountedComponents[path.join("-")] = { component: component, subscriptions: subscriptions };
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

var traverse = function traverse(comp, path, state) {

  if (comp instanceof Component) {
    var componentPath = path.concat(comp.path);
    var componentState = getIn(state, componentPath);
    var props = _extends({ context: None() }, comp.props);

    var view = fold(componentState, function (state) {
      if (!isMounted(componentPath)) mountComponent(comp.component, componentPath);

      return comp.component.view({ state: state,
        actions: viewActions(comp.component, componentPath, state),
        props: props
      });
    }, function () {
      mountComponent(comp.component, componentPath);

      var _comp$component$init = comp.component.init(props),
          initState = _comp$component$init.state,
          initEffects = _comp$component$init.effects;

      initEffects.length && executeEffects(comp.component, initEffects, componentPath, initState);
      return comp.component.view({ state: initState,
        actions: viewActions(comp.component, componentPath, initState),
        props: props
      });
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

  return function (state, comp) {
    var domTree = traverse(comp, [], state);

    requestAnimationFrame(function () {
      element = patch(oldNode, oldNode = domTree, element, target);
      isRendering = false;
    });
  };
});