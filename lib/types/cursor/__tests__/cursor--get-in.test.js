import { Cursor, cursor, getIn, getOrElse, show } from "../../..";

test("it should return the value at the given path wrapped in a Some", function () {
  expect(show(getIn(cursor([[1, 2], [3, 4]], []), [0, 1]))).toEqual("Maybe.Some(2)");
  expect(show(getIn(cursor({ x: { y: 2 } }, []), ["x", "y"]))).toEqual("Maybe.Some(2)");
});

test("if the value at the given path does not exist it should return a None", function () {
  expect(show(getIn(cursor([1, 2, 3], []), [0, 1]))).toEqual("Maybe.None()");
});

test("it should return the value at the given index unwrapped when a default value is provided", function () {
  expect(getIn(cursor([[1, 2], [3, 4]], []), [0, 1], 10)).toEqual(2);
});

test("it should return the default value when no value is found and a default value is provided", function () {
  expect(getIn(cursor([[1, 2], [3, 4]], []), [0, 4], 10)).toEqual(10);
});