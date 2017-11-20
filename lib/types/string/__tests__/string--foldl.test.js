import { foldl } from "../../..";

test("it should fold an array to a value from the left", function () {
  expect(foldl("foobar", "", function (acc, v) {
    return acc + v;
  })).toEqual("foobar");
});