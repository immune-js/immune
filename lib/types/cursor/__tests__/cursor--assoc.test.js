import { Cursor, cursor, assoc, show } from "../../..";

test("it should update the value associated with the given key in the underlying collection", function () {
  expect(assoc(cursor([1, 2, 3], []), 0, 44)).toEqual([44, 2, 3]);
});