import { Union, caseOf, evolve, get_ } from "../..";

import { h, component } from "../../ui";

import Router from "./index";

var defaultView = function defaultView(_ref) {
  var view = _ref.view;
  return view();
};

export var createRouter = function createRouter(routes) {
  var viewContainer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultView;


  var Msg = Union("Msg", { LocationChange: [Object],
    RequestPage: [String]
  });

  var init = function init() {
    return { state: { route: { path: "/", params: {}, uri: "/" } }, effects: [] };
  };

  var update = function update(state, msg) {
    return caseOf(msg, { LocationChange: function LocationChange(route) {
        return { state: evolve(state, { route: route }), effects: [] };
      },
      RequestPage: function RequestPage(url) {
        return { state: state, effects: [Router.navigateTo(url, {})] };
      }
    });
  };

  var view = function view(state) {
    var currentRoute = get_(state, "route");
    return viewContainer({ view: Router.view([state, "route"], routes),
      currentRoute: currentRoute
    });
  };

  var subscriptions = function subscriptions(scope) {
    return [Router.listen(routes, Msg.LocationChange), Router.interceptLinks(Msg.RequestPage)];
  };

  return component({ Msg: Msg, init: init, update: update, view: view, subscriptions: subscriptions });
};