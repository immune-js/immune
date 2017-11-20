import { empty } from "../../../index";

test("it returns an empty object", function () {
  expect(empty({ x: 1, y: 2 })).toEqual({});
});