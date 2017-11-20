import { cursor, conj } from "../../..";

test("it should conjoin an item onto the underlying collection", function () {
  expect(conj(cursor([1, 2, 3]), 4)).toEqual([1, 2, 3, 4]);
  expect(conj(cursor("ba"), "r")).toEqual("bar");
  expect(conj(cursor({ x: 1 }, []), ["y", 2])).toEqual({ x: 1, y: 2 });
  expect(conj(cursor({ x: 1 }, []), { y: 2 })).toEqual({ x: 1, y: 2 });
});