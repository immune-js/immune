import { Cursor, cursor, map, show } from "../../..";

test("it should delegate to the underlying collection", function () {
  expect(map(cursor([1, 2, 3], []), function (x) {
    return x + 1;
  })).toEqual([2, 3, 4]);
});