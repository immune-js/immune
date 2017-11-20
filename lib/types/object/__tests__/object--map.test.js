var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { map } from "../../../index";

test("it returns a new object from the result of applying a function to each of it's values", function () {
  expect(map({ x: 1, y: 2 }, function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

    return v + 1;
  })).toEqual([2, 3]);
});

test("it is non-destructive", function () {
  var obj = { x: 1, y: 2 };
  map(obj, function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        k = _ref4[0],
        v = _ref4[1];

    return v + 1;
  });
  expect(obj).toEqual({ x: 1, y: 2 });
});

test("it does nothing for empty objects", function () {
  expect(map({}, function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        k = _ref6[0],
        v = _ref6[1];

    return v + 1;
  })).toEqual([]);
});

test("it should curry the mapping function", function () {
  return expect(map(map({ x: 1, y: 2, z: 3 }, function (_ref7, y) {
    var _ref8 = _slicedToArray(_ref7, 2),
        k1 = _ref8[0],
        x = _ref8[1];

    return x + y;
  }), function (f) {
    return f(4);
  })).toEqual([5, 6, 7]);
});