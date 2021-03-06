import { Some, None, get, equals } from '../../../index';

test("it should return the value wrapped in a Some when non-null value exists at the specified index", function () {
  expect(equals(get([1, 2, 3], 0), Some(1))).toBe(true);
});

test("it should return a None when the index is out of range", function () {
  expect(equals(get([1, 2, 3], 4), None())).toBe(true);
});

test("it should return a None when the index points to a null value", function () {
  expect(equals(get([null, 2, 3], 0), None())).toBe(true);
});

test("it should return a None when the index points to a undefined value", function () {
  expect(equals(get([undefined, 2, 3], 0), None())).toBe(true);
});

test("it should return the value unwrapped if a fallback is provided", function () {
  expect(get([1, 2, 3], 0, 10)).toBe(1);
});

test("it should return the fallback if it is provided and no value was found", function () {
  expect(get([], 0, 10)).toBe(10);
});

test("it should return the fallback if it is provided and the value is undefined", function () {
  expect(get([undefined], 0, 10)).toBe(10);
});

test("it should return the fallback if it is provided and the value is undefined", function () {
  expect(get([null], 0, 10)).toBe(10);
});