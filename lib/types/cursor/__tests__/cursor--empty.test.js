import { cursor, empty, show } from "../../..";

test("it should empty the underlying collection", function () {
  expect(empty(cursor([[1], [2], [3]]))).toEqual([]);
  expect(empty(cursor([[1], [2], [3]]))).toEqual([]);
  expect(empty(cursor([[1], [2], [3]]))).toEqual([]);

  expect(empty(cursor([[[1], [2], [3]]], [0]))).toEqual([]);
  expect(empty(cursor([[[1], [2], [3]]], [0]))).toEqual([]);
  expect(empty(cursor([[[1], [2], [3]]], [0]))).toEqual([]);
});