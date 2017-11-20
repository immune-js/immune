import { count } from "../../..";

test("it should return the length of an array", function () {
  expect(count([1, 2, 3, 4, 5, 6])).toBe(6);
});