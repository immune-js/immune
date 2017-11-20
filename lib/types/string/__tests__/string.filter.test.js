import { filter } from "../../..";

test("it should return a new string containing only the items that satisfies a predicate", function () {
  expect(filter("foobar", function (x) {
    return x === "o";
  })).toEqual("oo");
});