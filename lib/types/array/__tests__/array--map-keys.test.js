import { mapKeys } from "../../../index";

test("it creates a new array from the result of applying a function to each key in a non-empty array", function () {
  expect(mapKeys([1, 2, 3], function (k) {
    return k;
  })).toEqual([0, 1, 2]);
});

test("it doesn't modify the original array", function () {
  var orig = [1, 2, 3];
  mapKeys(orig, function (k) {
    return k;
  });
  expect(orig).toEqual([1, 2, 3]);
});

test("it does nothing for empty arrays", function () {
  expect(mapKeys([], function (k) {
    return k;
  })).toEqual([]);
});