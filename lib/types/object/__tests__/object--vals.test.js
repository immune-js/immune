import { vals } from "../../..";

test("it should return a list of all the values in an object", function () {
  expect(vals({ a: 4, b: 5, c: 6 })).toEqual([4, 5, 6]);
});