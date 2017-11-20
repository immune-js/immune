import { every } from "../../../index";

test("it returns true for empty arrays", function () {
  expect(every([], function (v) {
    return v === 2;
  })).toEqual(true);
});

test("it returns true if all of the values satisfies a predicate", function () {
  expect(every([1, 2], function (v) {
    return v === 1 || v === 2;
  })).toEqual(true);
});

test("it returns false if only some values match", function () {
  expect(every([1, 2, 3], function (v) {
    return v === 2;
  })).toEqual(false);
});

test("it returns false if the last value matches but earlier did not", function () {
  expect(every([1, 2, 3], function (v) {
    return v === 3;
  })).toEqual(false);
});