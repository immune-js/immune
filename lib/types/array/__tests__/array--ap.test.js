import { map, ap } from "../../../index";

test("it should apply each value in one array to each function in another", function () {
  expect(ap([function (x) {
    return x * 2;
  }, function (x) {
    return x + 3;
  }], [1, 2, 3])).toEqual([2, 4, 6, 4, 5, 6]);
});

test("it should return empty array if the first array is empty", function () {
  expect(ap([], [1, 2, 3])).toEqual([]);
});

test("it should return empty array if the second array is empty", function () {
  expect(ap([function (x) {
    return x * 2;
  }, function (x) {
    return x + 3;
  }], [])).toEqual([]);
});

test("it should return empty array if both arrays are empty", function () {
  expect(ap([], [])).toEqual([]);
});