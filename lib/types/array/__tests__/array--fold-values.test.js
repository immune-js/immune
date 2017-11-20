import { foldValues } from "../../..";

test("it should act the same way as foldl does", function () {
  expect(foldValues([1, 2, 3], 0, function (acc, v) {
    return acc + v;
  })).toEqual(6);
});