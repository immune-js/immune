import { count } from "../../..";

test("it should return the length of a string", function () {
  expect(count("foobar")).toBe(6);
});