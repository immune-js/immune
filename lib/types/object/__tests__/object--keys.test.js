import { keys } from "../../..";

test("it should return a list of all the keys of an object", function () {
  expect(keys({ a: 4, b: 5, c: 6 })).toEqual(["a", "b", "c"]);
});