import { foldValues } from "../../..";

test("it should act the same way as foldl does", function () {
  expect(foldValues("foobar", "", function (acc, v) {
    return acc + v;
  })).toEqual("foobar");
});