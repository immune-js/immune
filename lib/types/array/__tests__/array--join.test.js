import { join } from "../../..";

test("it should stringify the items of an array and join them together with a separator", function () {
  expect(join([1, 2, 3], " + ")).toBe("1 + 2 + 3");
  expect(join([[1, 2], [3, 4]], ", ")).toBe("[ 1, 2 ], [ 3, 4 ]");
});