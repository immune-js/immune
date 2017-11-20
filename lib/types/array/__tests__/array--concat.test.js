import { concat } from "../../..";

test("it should concatenate two arrays", function () {
  expect(concat([1, 2, 3], [4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6]);
});

test("it should concatenate multiple arrays", function () {
  expect(concat([1, 2, 3], [4, 5, 6], [7, 8, 9])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
});