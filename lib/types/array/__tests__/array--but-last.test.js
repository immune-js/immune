import { Some, None, butLast, equals } from '../../..';

test("it returns an empty array when called on an empty array", function () {
  expect(butLast([])).toEqual([]);
});

test("it returns an empty array when called on an array with one element", function () {
  expect(butLast([1])).toEqual([]);
});

test("it returns an array containing all but the last element when called on an array with multiple elements", function () {
  expect(butLast([1, 2, 3])).toEqual([1, 2]);
});