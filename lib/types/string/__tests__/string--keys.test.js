import { keys } from "../../..";

test("it should return a list of all the indices in a string", function () {
  expect(keys("abc")).toEqual([0, 1, 2]);
});