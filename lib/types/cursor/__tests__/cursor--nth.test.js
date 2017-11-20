import { cursor, nth, show } from "../../..";

test("it should return the nth item in the underlying collection", function () {
  expect(show(nth(cursor([1, 2, 3]), 0))).toEqual("Maybe.Some(1)");
  expect(show(nth(cursor([1, 2, 3]), 1))).toEqual("Maybe.Some(2)");
  expect(show(nth(cursor([1, 2, 3]), 2))).toEqual("Maybe.Some(3)");

  expect(show(nth(cursor([[1], [2], [3]]), 0))).toEqual("Maybe.Some([ 1 ])");
  expect(show(nth(cursor([[1], [2], [3]]), 1))).toEqual("Maybe.Some([ 2 ])");
  expect(show(nth(cursor([[1], [2], [3]]), 2))).toEqual("Maybe.Some([ 3 ])");
});