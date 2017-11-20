import { empty } from "../../../index";

test("it returns an empty string", function () {
  expect(empty("abc")).toEqual("");
});