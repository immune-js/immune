import { foldValues } from "../../..";

test("it should always pass only the value not key/value pair as foldl does", function () {
  expect(foldValues({ x: 1, y: 2, z: 3 }, 0, function (acc, v) {
    return acc + v;
  })).toEqual(6);
});