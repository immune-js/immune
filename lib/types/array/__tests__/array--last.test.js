import { Some, None, last, equals } from '../../..';

test("it returns the last element wrapped in a Some from an array with one element", function () {
  expect(equals(last([1]), Some(1))).toBe(true);
});

test("it returns the last element wrapped in a Some from an array with multiple elements", function () {
  expect(equals(last([1, 2, 3]), Some(3))).toBe(true);
});

test("it returns None when called on an empty array", function () {
  expect(equals(last([]), None())).toBe(true);
});