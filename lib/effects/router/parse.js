var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import { Maybe, caseOf, foldl, map, is, IMMUNE_ARGS_SYM } from "../..";

import toRegex from "path-to-regexp";

var matchURI = function matchURI(path, uri, types) {
  var keys = [];
  var pattern = toRegex(path, keys); // TODO: cache paths
  var match = pattern.exec(uri);

  if (!match) return Maybe.None();

  var params = [];
  var typesMatch = true;

  for (var i = 1; i < match.length; i++) {
    var param = match[i];

    try {
      param = JSON.parse(decodeURI(param));
    } catch (ex) {}

    if (param && types[i - 1] === Object ? param.constructor === Object : is(param, types[i - 1])) params.push(param);else {
      typesMatch = false;
      break;
    }
  }

  return typesMatch ? Maybe.Some(params) : Maybe.None();
};

export default (function (location, routeMap) {
  return foldl(routeMap, Maybe.None(), function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        path = _ref2[0],
        route = _ref2[1];

    return caseOf(acc, { Some: Maybe.Some,
      None: function None() {
        return map(matchURI(path, location.path, route[IMMUNE_ARGS_SYM]), function (params) {
          return route.apply(undefined, _toConsumableArray(params));
        });
      }
    });
  });
});