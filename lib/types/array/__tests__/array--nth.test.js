import { Some, None, nth, equals } from '../../../index';

test("it should return the value wrapped in a Some when non-null value exists at the specified index", function () {
  expect(equals(nth([1, 2, 3], 0), Some(1))).toBe(true);
});

test("it should return None when the index is out of range", function () {
  expect(equals(nth([1, 2, 3], 4), None())).toBe(true);
});

test("it should return None when the index points to a null value", function () {
  expect(equals(nth([null, 2, 3], 0), None())).toBe(true);
});

test("it should return None when the index points to a undefined value", function () {
  expect(equals(nth([undefined, 2, 3], 0), None())).toBe(true);
});