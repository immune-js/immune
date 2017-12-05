var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Union, Task, andThen, map, foldl, getIn_, assocIn, dissocIn } from "../";

import { Component, AsyncComponent, MountComponent, UnmountComponent, step } from "../ui/component";

var executeEffects = function executeEffects(component, appState, path, effects, context) {
  return andThen(Task.parallel(effects.map(function (eff) {
    return eff instanceof Union ? Task.of(eff) : eff;
  })), function (msgs) {
    var next = msgs.reduce(function (current, msg) {
      if (!msg) return current;

      if (msg instanceof MountComponent) return step(assocIn(current.state, path.concat(msg.path), undefined));

      if (msg instanceof UnmountComponent) return step(dissocIn(current.state, path.concat(msg.path).map(function (x) {
        return x.toString();
      })));

      return transition(current, component.update(getIn_(current.state, path), msg, context), path);
    }, step(appState));

    return next.effects.length ? executeEffects(component, next.state, path, next.effects, context) : Task.of(next.state);
  });
};

var mountComponent = function mountComponent(Component, appState, path, context) {
  var _Component$component$ = Component.component.init(_extends({ context: context }, Component.props)),
      state = _Component$component$.state,
      effects = _Component$component$.effects;

  return executeEffects(Component.component, assocIn(appState, path, state), path, effects, context);
};

var traverseVdomTree = function traverseVdomTree(vnode, state, path, context) {
  var html = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";

  if (vnode instanceof AsyncComponent) return andThen(vnode.component, function (asyncComp) {
    return traverseVdomTree(asyncComp["default"]((path[0] === "application" ? path.slice(1, path.length) : path).concat(vnode.path), vnode.props), state, path, context, html);
  });

  if (vnode instanceof Component) return andThen(mountComponent(vnode, state, path.concat(vnode.path), context), function (nextState) {
    var nextVdom = vnode.component.view({ state: getIn_(nextState, path.concat(vnode.path)),
      actions: {},
      props: _extends({ context: context }, vnode.props)
    });
    return traverseVdomTree(nextVdom, nextState, path.concat(vnode.path), context, html);
  });

  var tag = vnode.tag;
  var attrs = Object.keys(vnode.data || {});
  var children = vnode.children || [];

  return map(foldl(children, Task.of([state, ""]), function (acc, child) {
    return andThen(acc, function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          nextState = _ref2[0],
          html = _ref2[1];

      return typeof child === "string" ? Task.of([state, html + child]) : traverseVdomTree(child, nextState, path, context, html);
    });
  }), function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        state = _ref4[0],
        childHTML = _ref4[1];

    return [state, html + ("<" + tag + " " + attrs.map(function (attr) {
      return attr + "=\"" + stringifyAttribute(attr, vnode.data[attr]) + "\"";
    }).join(" ") + ">" + childHTML + "</" + tag + ">")];
  });
};

export default (function (Component, context) {
  return andThen(traverseVdomTree(Component, {}, [], context), function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        state = _ref6[0],
        html = _ref6[1];

    return Task.of((console.log("appState:", JSON.stringify(state)), [state, html]));
  });
});

// -- Utils

var stringifyAttribute = function stringifyAttribute(attr, val) {
  return attr === "style" ? Object.keys(val).reduce(function (acc, key) {
    return acc + key.replace(/[A-Z]/g, "-$&").toLowerCase() + ":" + val[key] + ";";
  }, "") : val;
};

var transition = function transition(current, next, path) {
  return step(assocIn(current.state, path, next.state), current.effects.concat(next.effects));
};