import { Cursor, cursor, show } from "../../..";

test("it should wrap an associative collection in a cursor instance", function () {
  expect(cursor([1, 2, 3]) instanceof Cursor).toBe(true);
  expect(cursor([1, 2, 3]).coll).toEqual([1, 2, 3]);
  expect(cursor([1, 2, 3]).path).toEqual([]);
});

test("it should not wrap non-associative collections in a cursor", function () {
  expect(cursor(1) instanceof Cursor).toBe(false);
  expect(cursor(1)).toEqual(1);
});

test("given a cursor it should return a new cursor wrapping the collection at the given path and the updated path", function () {
  var state = cursor({ x: { y: { z: 2 } } }, ["x"]);
  expect(cursor(state, ["y"]) instanceof Cursor).toBe(true);
  expect(cursor(state, ["y"]).coll).toEqual({ z: 2 });
  expect(cursor(state, ["y"]).path).toEqual(["x", "y"]);
  expect(state.path).toEqual(["x"]);
});