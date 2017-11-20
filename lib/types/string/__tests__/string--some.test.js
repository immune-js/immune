import { some } from "../../../index";

test("it returns false for empty strings", function () {
  expect(some("", function (v) {
    return v === "a";
  })).toEqual(false);
});

test("it returns true if at least one of the characters satisfies a predicate", function () {
  expect(some("bar", function (v) {
    return v === "r";
  })).toEqual(true);
});

test("it returns true even if folowing values return false", function () {
  expect(some("bar", function (v) {
    return v === "a";
  })).toEqual(true);
});

test("it returns true if multiple values satisfies a predicate", function () {
  expect(some("foobar", function (v) {
    return v === "o" || v === "b";
  })).toEqual(true);
});

test("it returns false if at none of the values satisfies a predicate", function () {
  expect(some("bar", function (v) {
    return v === "f";
  })).toEqual(false);
});