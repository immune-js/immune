var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { Task, Some, andThen, show } from "../";

import { createLocation } from "../effects/location";

import EJSON from "meteor-ejson";
import traverse from "./traverse";
import fetch from "isomorphic-fetch";

global.fetch = fetch;

console.log("server required");

export default (function (App, _ref) {
  var _ref$template = _ref.template,
      template = _ref$template === undefined ? "" : _ref$template,
      tags = _ref.tags;

  var render = function render(_ref2) {
    var context = _ref2.context,
        _ref2$lang = _ref2.lang,
        lang = _ref2$lang === undefined ? "en" : _ref2$lang,
        _ref2$dir = _ref2.dir,
        dir = _ref2$dir === undefined ? "ltr" : _ref2$dir;

    var location = createLocation(context.path, context.search, context.params, context.hash);
    var app = App("application", { context: Some(context), location: location });

    return Task.toPromise(andThen(traverse(app, Some(context)), function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          state = _ref4[0],
          html = _ref4[1];

      return Task.of(template.replace(tags.title, context.state.title).replace(tags.lang, lang).replace(tags.dir, dir).replace(tags.state, "<script type='text/javascript'>window.APPLICATION_STATE = '" + EJSON.stringify(state) + "'</script>").replace(tags.view, html));
    }));
  };

  return { render: render };
});