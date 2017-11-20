import { cursor, flatten, show } from "../../..";

test("it should flatten the underlying collection", function () {
  expect(flatten(cursor([[1], [2], [3]]))).toEqual([1, 2, 3]);
  expect(flatten(cursor([[1], [2], [3]]))).toEqual([1, 2, 3]);
  expect(flatten(cursor([[1], [2], [3]]))).toEqual([1, 2, 3]);

  expect(flatten(cursor([[[1], [2], [3]]], [0]))).toEqual([1, 2, 3]);
  expect(flatten(cursor([[[1], [2], [3]]], [0]))).toEqual([1, 2, 3]);
  expect(flatten(cursor([[[1], [2], [3]]], [0]))).toEqual([1, 2, 3]);
});