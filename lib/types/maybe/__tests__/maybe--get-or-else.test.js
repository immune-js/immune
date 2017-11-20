import { maybe, getOrElse } from "../../..";

test("it should return the value contained inside of a Some", function () {
  return expect(getOrElse(maybe(2), "err")).toBe(2);
});

test("it should return the fallback value when given None", function () {
  return expect(getOrElse(maybe(null), "err")).toBe("err");
});