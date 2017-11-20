import { cursor, rest, first, map, getOrElse } from "../../..";

test("it should return all elements but the first from the underlying collection", function () {
  expect(rest(cursor([1, 2, 3]))).toEqual([2, 3]);
  expect(rest(rest(cursor([1, 2, 3])))).toEqual([3]);
});