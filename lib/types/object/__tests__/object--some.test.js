var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { some } from "../../../index";

test("it returns false for empty objects", function () {
  expect(some({}, function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

    return v === 2;
  })).toEqual(false);
});

test("it returns true if at least one of the values satisfies a predicate", function () {
  expect(some({ x: 1, y: 2 }, function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        k = _ref4[0],
        v = _ref4[1];

    return v === 2;
  })).toEqual(true);
});

test("it returns true even if folowing values return false", function () {
  expect(some({ x: 1, y: 2, z: 3 }, function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        k = _ref6[0],
        v = _ref6[1];

    return v === 2;
  })).toEqual(true);
});

test("it returns true if multiple values satisfies a predicate", function () {
  expect(some({ x: 1, y: 2, z: 3 }, function (_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        k = _ref8[0],
        v = _ref8[1];

    return v === 1 || v === 2;
  })).toEqual(true);
});

test("it returns false if at none of the values satisfies a predicate", function () {
  expect(some({ x: 1, y: 2, z: 3 }, function (_ref9) {
    var _ref10 = _slicedToArray(_ref9, 2),
        k = _ref10[0],
        v = _ref10[1];

    return v === 10;
  })).toEqual(false);
});