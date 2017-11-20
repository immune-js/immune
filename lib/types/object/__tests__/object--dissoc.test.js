import { dissoc } from "../../..";

test("it should remove a specific key from a collection", function () {
  return expect(dissoc({ a: 1, b: 2, c: 3 }, "b")).toEqual({ a: 1, c: 3 });
});

test("it should do nothing when the key doesn't exist", function () {
  return expect(dissoc({ a: 1, b: 2, c: 3 }, "d")).toEqual({ a: 1, b: 2, c: 3 });
});