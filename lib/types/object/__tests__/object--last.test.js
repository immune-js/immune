import { Some, None, last, equals } from '../../..';

test("it returns the last key/value pair wrapped in a Some from an object with one key/value pair", function () {
  expect(equals(last({ x: 1 }), Some(["x", 1]))).toBe(true);
});

test("it returns the last key/value pair wrapped in a Some from an object with multiple key/value pairs", function () {
  expect(equals(last({ x: 1, y: 2, z: 3 }), Some(["z", 3]))).toBe(true);
});

test("it returns None when called on an empty object", function () {
  expect(equals(last({}), None())).toBe(true);
});