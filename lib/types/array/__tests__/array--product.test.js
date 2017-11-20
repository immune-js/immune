import { product } from "../../..";

test("it should return the product of all numbers in an array", function () {
  expect(product([1, 2, 3, 4, 5, 6])).toBe(720);
});