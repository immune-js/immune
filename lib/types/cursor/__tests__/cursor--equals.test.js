import { cursor, equals, show } from "../../..";

test("it should perform a deep equality check of it's underlying collection against a different object", function () {
  expect(equals(cursor([1, 2, 3]), [1, 2, 3])).toEqual(true);
  expect(equals(cursor([1, 2, 3]), [4, 5, 6])).toEqual(false);

  expect(equals(cursor([[1, 2, 3]], [0]), [1, 2, 3])).toEqual(true);
  expect(equals(cursor([[1, 2, 3]], [0]), [4, 5, 6])).toEqual(false);
});

test("it should perform a deep equality check of it's underlying collection against a different cursor", function () {
  expect(equals(cursor([1, 2, 3]), cursor([1, 2, 3]))).toEqual(true);
  expect(equals(cursor([1, 2, 3]), cursor([4, 5, 6]))).toEqual(false);

  expect(equals(cursor([[1, 2, 3]], [0]), cursor([1, 2, 3]))).toEqual(true);
  expect(equals(cursor([[1, 2, 3]], [0]), cursor([4, 5, 6]))).toEqual(false);

  expect(equals(cursor([1, 2, 3]), cursor([[1, 2, 3]], [0]))).toEqual(true);
  expect(equals(cursor([1, 2, 3]), cursor([[4, 5, 6]], [0]))).toEqual(false);

  expect(equals(cursor([[1, 2, 3]], [0]), cursor([[1, 2, 3]], [0]))).toEqual(true);
  expect(equals(cursor([[1, 2, 3]], [0]), cursor([[4, 5, 6]], [0]))).toEqual(false);
});