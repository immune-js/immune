var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import AppState from "./app-state";
import renderer from "./renderer";
import parseRoute from "./parse-route";
import History from "../effects/history";
import hyperappTransitions from "hyperapp-transitions";

import { Maybe, get_, fold } from "../";

export default (function (routes, target) {

  var render = renderer(target);

  document.addEventListener("click", function (e) {
    if (e.target.tagName === "A" && e.target.getAttribute("data-route") === "true") {
      e.preventDefault();
      History.push(e.target.pathname).fork(function () {}, function () {});
    }
  });

  History.listen(function (location) {
    return parseRoute(routes.pages, location);
  }).addListener({ next: function next(route) {
      return AppState.assocIn(["activeRoute"], route);
    },
    error: function error(err) {
      return console.error(err);
    }
  });

  AppState.subscribe(function (state) {
    var activeRoute = fold(get_(state, "activeRoute"), function (route) {
      return { page: routes.pages[route.path], route: route };
    }, function (error) {
      return { page: routes.pages[404], route: error };
    });

    var layoutProps = { context: Maybe.None(), page: _extends({}, activeRoute.page, { props: _extends({ route: activeRoute.route }, activeRoute.page.props) }), route: activeRoute.route };
    var pageProps = _extends({ context: Maybe.None(), route: activeRoute.route }, activeRoute.page.props);

    var Component = activeRoute.layout !== false && routes.layout ? routes.layout("application", _extends({}, layoutProps, activeRoute.route.props)) : page.component(activeRoute.route.path, _extends({}, pageProps, activeRoute.route.props));

    render(state, Component);
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
export { default as component } from "./component";
export * from "./component";

export var transitions = hyperappTransitions;