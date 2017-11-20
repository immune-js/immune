import { foldr } from "../../..";

test("it should fold an array to a value from the right", function () {
  expect(foldr("foobar", "", function (acc, v) {
    return acc + v;
  })).toEqual("raboof");
});