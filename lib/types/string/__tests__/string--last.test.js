import { Some, None, last, equals } from '../../..';

test("it returns the last char wrapped in a Some from a one character string", function () {
  expect(equals(last("a"), Some("a"))).toBe(true);
});

test("it returns the last char wrapped in a Some from a string with multiple characters", function () {
  expect(equals(last("bar"), Some("r"))).toBe(true);
});

test("it returns None when called on an empty string", function () {
  expect(equals(last(""), None())).toBe(true);
});