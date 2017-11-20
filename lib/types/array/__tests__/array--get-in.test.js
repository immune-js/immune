import { Maybe, getIn, equals } from "../../..";

test("it should return the original collection wrapped in a Some when given an empty path", function () {
  expect(equals(getIn([1, { y: { z: 1 } }], []), Maybe.Some([1, { y: { z: 1 } }]))).toBe(true);
});

test("it should return the value wrapped in a Some if one exists at the specified path", function () {
  expect(equals(getIn([1, { y: { z: 1 } }], [1, 'y', 'z']), Maybe.Some(1))).toBe(true);
  expect(equals(getIn([1, { y: { z: 1, a: 2 } }], [1, 'y', 'a']), Maybe.Some(2))).toBe(true);
});

test("it should return a None if no value exists at the specified path", function () {
  expect(equals(getIn([1, { y: { z: 1 } }], [1, 'y', 'x']), Maybe.None())).toBe(true);
  expect(equals(getIn([1, { y: { z: 1, a: 2 } }], [1, 'y', 'y']), Maybe.None())).toBe(true);
});

test("it should return the value unwrapped if a fallback is provided", function () {
  expect(getIn([[1, 2], [3, 4]], [0, 1], 10)).toBe(2);
});

test("it should return the fallback if it is provided and no value was found", function () {
  expect(getIn([[], []], [0, 1], 10)).toBe(10);
  expect(getIn([], [0, 1], 10)).toBe(10);
});

test("it should return the fallback if it is provided and the value is undefined", function () {
  expect(getIn([[1, undefined]], [0, 1], 10)).toBe(10);
  expect(getIn([undefined], [0, 1], 10)).toBe(10);
});

test("it should return the fallback if it is provided and the value is undefined", function () {
  expect(getIn([[null]], [0, 1], 10)).toBe(10);
  expect(getIn([null], [0, 1], 10)).toBe(10);
});