import { Cursor, cursor, vals, show } from "../../..";

test("it should return the vals of the underlying collection", function () {
  expect(vals(cursor({ a: 1, b: 2, c: 3 }, []))).toEqual([1, 2, 3]);
  expect(vals(cursor({ x: { y: { a: 1, b: 2, c: 3 } } }, ["x", "y"]))).toEqual([1, 2, 3]);
});

test("it should work from the current cursor path", function () {});