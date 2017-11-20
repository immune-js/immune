var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Task, maybe, andThen } from "../";

import { createLocation } from "../effects/location";

import EJSON from "meteor-ejson";
import traverse from "./traverse";
import fetch from "isomorphic-fetch";

global.fetch = fetch;

export default (function (routes, _ref) {
  var _ref$template = _ref.template,
      template = _ref$template === undefined ? "" : _ref$template,
      tags = _ref.tags;

  var render = function render(_ref2) {
    var ctx = _ref2.ctx,
        route = _ref2.route,
        _ref2$lang = _ref2.lang,
        lang = _ref2$lang === undefined ? "en" : _ref2$lang,
        _ref2$dir = _ref2.dir,
        dir = _ref2$dir === undefined ? "ltr" : _ref2$dir;

    var currentRoute = createLocation(ctx.path, ctx.search, ctx.params, ctx.hash);
    var page = routes.pages[route];

    var layoutProps = { context: maybe(ctx), page: _extends({}, page, { props: _extends({ route: currentRoute }, page.props) }), route: currentRoute };
    var pageProps = _extends({ context: maybe(ctx), route: currentRoute }, page.props);

    var Component = page.layout !== false && routes.layout ? (console.log("got app"), routes.layout("application", _extends({}, layoutProps, route.props))) : (console.log("no app"), routes.pages[route].component(route, _extends({}, pageProps, route.props)));

    return Task.toPromise(andThen(traverse(Component, ctx), function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          state = _ref4[0],
          html = _ref4[1];

      return Task.of(template.replace(tags.lang, lang).replace(tags.dir, dir).replace(tags.title, "<title>" + routes.pages[route].title + "</title>").replace(tags.state, "<script type='text/javascript'>window.APPLICATION_STATE = '" + EJSON.stringify(state) + "'</script>").replace(tags.view, html));
    }));
  };

  return { render: render };
});