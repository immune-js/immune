import AppState from "./app-state";
import renderer from "./renderer";
import parseRoute from "./parse-route";
import History from "../effects/history";
import hyperappTransitions from "hyperapp-transitions";

import { Maybe, get_, fold } from "../";

export default (function (component, target) {
  var render = renderer(target);
  var location = History.toLocation(document.location);
  var instance = component("application", { location: location });

  AppState.subscribe(function (state) {
    return render(state, instance);
  });

  // Trigger initial render
  AppState.update(function (state) {
    return state;
  });
});

export var preventDefault = function preventDefault(msg) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return function (e) {
    return e.preventDefault(), msg.apply(undefined, args);
  };
};

export var targetValue = function targetValue(msg) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return function (e) {
    return msg.apply(undefined, [e.target.value].concat(args));
  };
};

export { default as h } from "./h";
export * from "./component";

export var transitions = hyperappTransitions;