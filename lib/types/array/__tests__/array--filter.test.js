import { filter } from "../../..";

test("it should return a new collection containing only the items that satisfies a predicate", function () {
  expect(filter([1, 2, 3, 4, 5], function (x) {
    return x <= 3;
  })).toEqual([1, 2, 3]);
});