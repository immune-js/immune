import { map } from "../../../index";

test("it creates a new array from the result of applying a function to each element in a non-empty array", function () {
  expect(map([1, 2, 3], function (x) {
    return x + 1;
  })).toEqual([2, 3, 4]);
});

test("it doesn't modify the original array", function () {
  var orig = [1, 2, 3];
  map(orig, function (x) {
    return x + 1;
  });
  expect(orig).toEqual([1, 2, 3]);
});

test("it does nothing for empty arrays", function () {
  expect(map([], function (x) {
    return x + 1;
  })).toEqual([]);
});

test("it should curry the mapping function", function () {
  return expect(map(map([1, 2, 3], function (x, y) {
    return x + y;
  }), function (f) {
    return f(4);
  })).toEqual([5, 6, 7]);
});