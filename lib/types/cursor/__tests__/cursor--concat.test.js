import { cursor, concat, show } from "../../..";

test("it should empty the underlying collection", function () {
  expect(concat(cursor([[1], [2], [3]]), [[4], [5]])).toEqual([[1], [2], [3], [4], [5]]);
  expect(concat(cursor([[1], [2], [3]]), [[4], [5]])).toEqual([[1], [2], [3], [4], [5]]);
  expect(concat(cursor([[1], [2], [3]]), [[4], [5]])).toEqual([[1], [2], [3], [4], [5]]);

  expect(concat(cursor([[[1], [2], [3]]], [0]), [[4], [5]])).toEqual([[1], [2], [3], [4], [5]]);
  expect(concat(cursor([[[1], [2], [3]]], [0]), [[4], [5]])).toEqual([[1], [2], [3], [4], [5]]);
  expect(concat(cursor([[[1], [2], [3]]], [0]), [[4], [5]])).toEqual([[1], [2], [3], [4], [5]]);
});