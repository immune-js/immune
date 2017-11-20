import { Maybe, find, equals } from "../../..";

test("it should return the first char that satisfies the predicate wrapped in a some", function () {
  expect(equals(find("foobar", function (x) {
    return x === "b" || x === "a";
  }), Maybe.Some("b"))).toBe(true);
});

test("it should return none if no value satisfies the predicate", function () {
  expect(equals(find("foobar", function (x) {
    return x === "z";
  }), Maybe.None())).toBe(true);
});