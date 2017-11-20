import { cursor, andThen } from "../../..";

test("it should delegate to its underlying collection", function () {
  expect(andThen(cursor([1, 2, 3]), function (x) {
    return [x, x];
  })).toEqual([1, 1, 2, 2, 3, 3]);
  expect(andThen(cursor([[1, 2, 3]], [0]), function (x) {
    return [x, x];
  })).toEqual([1, 1, 2, 2, 3, 3]);
});