import { Maybe, cursor, first, getOrElse, show, get } from "../../..";

test("it should return the value in a Some if it exists", function () {
  expect(first(cursor([1, 2, 3], [])) instanceof Maybe.Some).toBe(true);
  expect(getOrElse(first(cursor([1, 2, 3])), 0)).toBe(1);
  expect(getOrElse(first(cursor([1, 2, 3])), 0)).toBe(1);
  expect(getOrElse(first(cursor({ a: { x: 1 }, b: { y: 2 }, c: { z: 3 } })), {})).toEqual(["a", { x: 1 }]);
  expect(getOrElse(first(cursor({ x: { y: { z: 3 } } }, ['x'])), [])).toEqual(["y", { "z": 3 }]);
});

test("it should return a None if it doesn't exist", function () {
  expect(first(cursor([])) instanceof Maybe.None).toBe(true);
});