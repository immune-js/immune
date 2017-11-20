import { Some, None, first, caseOf, equals } from '../../..';

test("it returns the first value wrapped in a Some from an object with one key/value pair", function () {
  expect(equals(first({ x: 1 }), Some(["x", 1]))).toBe(true);
});

test("it returns the first value wrapped in a Some from an object with multiple key/value pairs", function () {
  expect(equals(first({ x: 1, y: 2, z: 3 }), Some(["x", 1]))).toBe(true);
});

test("it returns None when called on an empty object", function () {
  expect(equals(first({}), None())).toBe(true);
});