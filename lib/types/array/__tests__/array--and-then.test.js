import { map, andThen } from "../../../index";

test("it produces a new result by applying a function to each element and flattens the result", function () {
  expect(andThen([1, 2, 3], function (x) {
    return [x, x];
  })).toEqual([1, 1, 2, 2, 3, 3]);
});

test("it should return empty array if the array is empty", function () {
  expect(andThen([], function (x) {
    return [x, x];
  })).toEqual([]);
});