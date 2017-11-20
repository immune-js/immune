import { Cursor, cursor, keys, show } from "../../..";

test("it should return the keys of the underlying collection", function () {
  expect(keys(cursor({ a: 1, b: 2, c: 3 }, []))).toEqual(["a", "b", "c"]);
  expect(keys(cursor({ x: { y: { a: 1, b: 2, c: 3 } } }, ["x", "y"]))).toEqual(["a", "b", "c"]);
});