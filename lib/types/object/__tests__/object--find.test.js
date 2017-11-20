var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { Maybe, find, equals } from "../../..";

test("it should return the first key/value pair that satisfies the predicate wrapped in a some", function () {
  expect(equals(find({ a: 2, b: 2, c: 2 }, function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

    return k === "b" && v === 2;
  }), Maybe.Some(["b", 2]))).toBe(true);
});

test("it should return none if no value satisfies the predicate", function () {
  expect(equals(find({ a: 2, b: 2, c: 2 }, function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        k = _ref4[0],
        v = _ref4[1];

    return v === 10;
  }), Maybe.None())).toBe(true);
});