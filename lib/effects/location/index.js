var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { Type } from "../..";

export var Location = Type("Location", { path: String,
  query: Object,
  params: Object,
  search: String,
  hash: String
});

export default Location;

var parseQuery = function parseQuery() {
  var qs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  return qs.constructor === Object ? qs : qs.length ? qs.replace(/^\?/, "").split(/&/g).reduce(function (acc, kvp) {
    var _kvp$split = kvp.split("="),
        _kvp$split2 = _slicedToArray(_kvp$split, 2),
        k = _kvp$split2[0],
        v = _kvp$split2[1];

    acc[k] = v;return acc;
  }, {}) : {};
};

export var createLocation = function createLocation(path, search, params) {
  var hash = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
  return Location(path, parseQuery(search), params, search, hash);
};