import { Some, None, andThen, equals } from "../../..";

test("it should map a function over a Some and flatten the result", function () {
  expect(equals(andThen(Some(2), function (x) {
    return Some(x + 4);
  }), Some(6))).toBe(true);
});

test("it should return None when invoked over None", function () {
  expect(equals(andThen(None(), function (x) {
    return Some(x + 4);
  }), None())).toBe(true);
});

test("it should return None if the function returns None", function () {
  expect(equals(andThen(Some(2), function (x) {
    return None();
  }), None())).toBe(true);
});