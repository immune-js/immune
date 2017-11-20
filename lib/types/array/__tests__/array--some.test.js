import { some } from "../../../index";

test("it returns false for empty arrays", function () {
  expect(some([], function (v) {
    return v === 2;
  })).toEqual(false);
});

test("it returns true if at least one of the values satisfies a predicate", function () {
  expect(some([1, 2], function (v) {
    return v === 2;
  })).toEqual(true);
});

test("it returns true even if folowing values return false", function () {
  expect(some([1, 2, 3], function (v) {
    return v === 2;
  })).toEqual(true);
});

test("it returns true if multiple values satisfies a predicate", function () {
  expect(some([1, 2, 3], function (v) {
    return v === 1 || v === 2;
  })).toEqual(true);
});

test("it returns false if at none of the values satisfies a predicate", function () {
  expect(some([1, 2, 3], function (v) {
    return v === 10;
  })).toEqual(false);
});