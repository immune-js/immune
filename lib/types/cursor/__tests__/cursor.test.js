import { Cursor, Maybe, show } from "../../..";

it("should create an instance that has a pointer to a collection and a path", function () {
  expect(show(Cursor(Maybe.Some({ x: 1, y: 2 }), []).coll)).toEqual("Maybe.Some({ x: 1, y: 2 })");
  expect(Cursor(Maybe.Some({ x: 1, y: 2 }), []).path).toEqual([]);

  expect(show(Cursor(Maybe.Some([1, 2, 3, 4]), []).coll)).toEqual("Maybe.Some([ 1, 2, 3, 4 ])");
  expect(Cursor(Maybe.Some([1, 2, 3, 4]), []).path).toEqual([]);

  expect(Cursor(Maybe.Some([1, 2, 3, 4]), [0]).path).toEqual([0]);
});