var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { Maybe, caseOf, foldl } from "../..";

import toRegex from "path-to-regexp";

var matchURI = function matchURI(path, uri) {
  var keys = [];
  var pattern = toRegex(path, keys); // TODO: cache paths
  var match = pattern.exec(uri);

  if (!match) return Maybe.None();

  var params = {};

  for (var i = 1; i < match.length; i++) {
    params[keys[i - 1].name] = match[i] !== undefined ? match[i] : undefined;
  }

  return Maybe.Some(params);
};

export default (function (routes, location) {
  return foldl(routes, Maybe.None(), function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        path = _ref2[0],
        route = _ref2[1];

    return caseOf(acc, { Some: function Some(route) {
        return Maybe.Some(route);
      },
      None: function None() {
        return caseOf(matchURI(path, location.path), { Some: function Some(params) {
            return Maybe.Some({ path: path, params: params, uri: location.path });
          },
          None: function None() {
            return Maybe.None();
          }
        });
      }
    });
  });
});