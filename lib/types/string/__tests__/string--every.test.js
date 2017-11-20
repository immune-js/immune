import { every } from "../../../index";

test("it returns true for empty strings", function () {
  expect(every("", function (v) {
    return v === "a";
  })).toEqual(true);
});

test("it returns true if all of the characters satisfies a predicate", function () {
  expect(every("bar", function (v) {
    return v === "b" || v === "a" || v === "r";
  })).toEqual(true);
});

test("it returns false if only some characters match", function () {
  expect(every("bar", function (v) {
    return v === "a";
  })).toEqual(false);
});

test("it returns false if the last character matches but earlier did not", function () {
  expect(every("bar", function (v) {
    return v === "r";
  })).toEqual(false);
});