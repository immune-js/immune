import { empty } from "../../../index";

test("it returns an empty array", function () {
  expect(empty([1, 2, 3])).toEqual([]);
});