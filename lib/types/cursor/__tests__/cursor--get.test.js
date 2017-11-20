import { Cursor, cursor, get, getOrElse, show } from "../../..";

test("it should return the value at the given path wrapped in a Some", function () {
  expect(show(get(cursor([1, 2, 3], []), 0))).toEqual("Maybe.Some(1)");
  expect(show(get(cursor({ x: { y: 2 } }, []), 'x'))).toEqual('Maybe.Some({ y: 2 })');
});

test("if the value at the given key/index does not exist it should return a None", function () {
  expect(show(get(cursor([1, 2, 3], []), 6))).toEqual("Maybe.None()");
});

test("it should return the value at the given index unwrapped when a default value is provided", function () {
  expect(get(cursor([1, 2, 3], []), 0, 10)).toEqual(1);
});

test("it should return the default value when no value is found and a default value is provided", function () {
  expect(get(cursor([1, 2, 3], []), 6, 10)).toEqual(10);
});