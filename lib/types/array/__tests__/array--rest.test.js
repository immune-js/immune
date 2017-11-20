import { Some, None, rest, caseOf, equals } from '../../..';

test("it returns an empty array when called on an empty array", function () {
  expect(rest([])).toEqual([]);
});

test("it returns an empty array when called on an array with one element", function () {
  expect(rest([1])).toEqual([]);
});

test("it returns an array containing all but the first element when called on an array with multiple elements", function () {
  expect(rest([1, 2, 3])).toEqual([2, 3]);
});