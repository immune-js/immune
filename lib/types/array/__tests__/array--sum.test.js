import { sum } from "../../..";

test("it should return the sum of all numbers in an array", function () {
  expect(sum([1, 2, 3, 4, 5, 6])).toBe(21);
});