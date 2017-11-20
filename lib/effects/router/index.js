var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Task, Union, caseOf, maybe, evolve, map, filter, get_, get, getIn_, getIn, getOrElse, andThen } from "../..";

import { h } from "../../ui";

import { eventStream } from "../../utils/event-stream";

import { component } from "../../ui";

import { query } from "../dom";

import History from "../history";
import Location from "../location";
import Console from "../console";
import parse from "./parser";

export var listen = function listen(routes, msg) {
  return map(History.listen(function (loc) {
    return parse(routes.pages, loc);
  }), function (match) {
    return msg(getOrElse(match, { path: "/404", uri: "/404", params: {} }));
  });
};

export var interceptLinks = function interceptLinks(routes, msg) {
  return map(filter(eventStream(function () {
    return document;
  }, "click", function (_) {
    return _;
  }), function (_ref) {
    var target = _ref.target;
    return target instanceof HTMLAnchorElement && target.onclick == null && target.target !== "_blank" ? caseOf(parse(routes.pages, target), { Some: function Some() {
        return true;
      }, None: function None() {
        return false;
      } }) : false;
  }
  // target instanceof HTMLAnchorElement && target.onclick == null && target.pathname[0] === "/" && target.pathname[1] !== "/" && target.target !== "_blank"
  ), function (event) {
    return event.preventDefault(), msg(event.target.pathname);
  });
};

export var navigateTo = History.push;

var setTitle = function setTitle(title) {
  return Task(function (fail, succeed) {
    return document.title = title, succeed();
  });
};

var init = function init(routes, context) {

  var layout = get(routes, "layout", { init: function init() {
      return { state: {}, effects: [] };
    },
    view: function view(state, actions, _ref2) {
      var _view = _ref2.view;
      return _view({});
    }
  });

  var Msg = Union("Msg", { LocationChange: [Object],
    RequestPage: [String],
    UpdateTitle: [Object]
  });

  var init = function init() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return { state: { route: { path: "/", params: {}, uri: "/" }, pages: {} },
      effects: []
    };
  };

  var update = function update(state, msg) {
    return caseOf(msg, { LocationChange: function LocationChange(route) {
        var before = getIn(routes, ["pages", route.path, "before"], { if: function _if(context) {
            return Task.of(false);
          } });

        var beforeEff = function beforeEff(bool, match) {
          if (bool) {
            var redirectTo = before["redirect"](get_(state, "route"), route);
            return caseOf(maybe(context), { Some: function Some(ctx) {
                return Task(function (fail, succeed) {
                  return ctx.redirect(redirectTo), succeed();
                });
              },
              None: function None() {
                return andThen(Task(function (fail, succeed) {
                  return setTimeout(succeed, 0);
                }), function () {
                  return navigateTo(redirectTo, {});
                });
              }
            });
          } else {
            return component.mount(match.page, ["pages", route.uri], _extends({ context: maybe(context) }, match.props, route.params));
          }
        };

        console.log("route.uri:", route.uri);

        return { state: evolve(state, { route: route }),
          effects: [component.mount(layout, "layout", { context: maybe(context) })].concat(caseOf(getIn(routes, ["pages", route.path]), { Some: function Some(match) {
              if (typeof before["if"] === "function" && typeof before["redirect"] === "function") return [andThen(before["if"](maybe(context)), function (bool) {
                return beforeEff(bool, match);
              })];else if (typeof before["unless"] === "function" && typeof before["redirect"] === "function") return [andThen(before["unless"](maybe(context)), function (bool) {
                return beforeEff(!bool, match);
              })];else return [beforeEff(false, match)];
            },
            None: function None() {
              return [];
            }
          }))
        };
      },
      UpdateTitle: function UpdateTitle(_ref3) {
        var path = _ref3.path;
        return { state: state,
          effects: caseOf(getIn(routes, ["pages", path]), { Some: function Some(page) {
              return [setTitle(page.title || path)];
            },
            None: function None() {
              return [];
            }
          })
        };
      },
      RequestPage: function RequestPage(url) {
        return { state: state, effects: [navigateTo(url, {})] };
      }
    });
  };

  var view = function view(state, actions, props) {
    var currentRoute = get_(state, "route");
    var statePath = [state, "pages", get_(currentRoute, "uri")];

    var routeView = caseOf(getIn(routes, ["pages", get_(currentRoute, "path")]), { Some: function Some(match) {
        return function () {
          var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          return getIn_(state, ["pages", get_(currentRoute, "path")]) ? component.view(match.page, statePath, _extends({ context: maybe(context) }, props)) : h("div");
        };
      },
      None: function None() {
        return function () {
          var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          return getIn(routes, ["404"], h("h1", "404 - Page not found"));
        };
      }
    });

    return component.view(layout, [state, "layout"], { context: maybe(context), view: routeView, currentRoute: get_(currentRoute, "path") });
  };

  var subscriptions = function subscriptions(scope) {
    return [listen(routes, Msg.LocationChange), listen(routes, Msg.UpdateTitle), interceptLinks(routes, Msg.RequestPage)];
  };

  return { Msg: Msg, init: init, update: update, view: view, subscriptions: subscriptions };
};

export default { init: init, parse: parse, listen: listen, interceptLinks: interceptLinks, navigateTo: navigateTo };