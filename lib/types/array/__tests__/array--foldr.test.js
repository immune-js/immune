import { foldr } from "../../..";

test("it should fold an object to a value starting from the right hand side", function () {
  expect(foldr([1, 2, 3], [], function (acc, v) {
    return acc.concat(v);
  })).toEqual([3, 2, 1]);
  expect(foldr([1, 2, 3], 0, function (acc, v) {
    return acc + v;
  })).toEqual(6);
});