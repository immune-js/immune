import { foldl } from "../../..";

test("it should fold an array to a value from the left", function () {
  expect(foldl([1, 2, 3], [], function (acc, v) {
    return acc.concat(v);
  })).toEqual([1, 2, 3]);
  expect(foldl([1, 2, 3], 0, function (acc, v) {
    return acc + v;
  })).toEqual(6);
});