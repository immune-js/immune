import { Maybe, find, equals } from "../../..";

test("it should return the first value that satisfies the predicate wrapped in a some", function () {
  expect(equals(find([1, 2, 3], function (x) {
    return x === 2 || x === 3;
  }), Maybe.Some(2))).toBe(true);
});

test("it should return none if no value satisfies the predicate", function () {
  expect(equals(find([1, 2, 3], function (x) {
    return x === 10;
  }), Maybe.None())).toBe(true);
});