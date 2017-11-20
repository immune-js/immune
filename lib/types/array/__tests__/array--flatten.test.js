import { flatten } from "../../../";

test("it should turn an array of arrays into an array of values", function () {
  expect(flatten([[1, 2, 3], [4, 5, 6], [7, 8, 9]])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
});