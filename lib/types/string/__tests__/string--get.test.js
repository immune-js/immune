import { Some, None, get, equals } from '../../../index';

test("it should return the value wrapped in a Some when non-null value exists at the specified index", function () {
  expect(equals(get("abc", 0), Some("a"))).toBe(true);
});

test("it should return a None when the index is out of range", function () {
  expect(equals(get("abc", 4), None())).toBe(true);
});

test("it should return the value unwrapped when non-null value exists at the specified index and a default is provided", function () {
  expect(get("abc", 0, 10)).toBe("a");
});

test("it should return the default value when the index is out of range and a default is provided", function () {
  expect(get("abc", 4, 10)).toBe(10);
});