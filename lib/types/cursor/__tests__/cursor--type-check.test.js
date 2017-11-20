import { cursor, typeCheck, is } from "../../..";

test("it should invoke typeCheck on the underlying collection", function () {
  expect(typeCheck(cursor([1, 2, 3]), Array)).toBe(true);
  expect(is(cursor([1, 2, 3], []), Array)).toBe(true);
});