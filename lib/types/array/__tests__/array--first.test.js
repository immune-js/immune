import { Some, None, first, caseOf, equals } from '../../..';

test("it returns the first element wrapped in a Some from an array with one element", function () {
  expect(equals(first([1]), Some(1))).toBe(true);
});

test("it returns the first element wrapped in a Some from an array with multiple elements", function () {
  expect(equals(first([1, 2, 3]), Some(1))).toBe(true);
});

test("it returns None when called on an empty array", function () {
  expect(equals(first([]), None())).toBe(true);
});