import { concat } from "../../..";

test("it should concatenate two strings", function () {
  expect(concat("foo", "bar")).toEqual("foobar");
});

test("it should concatenate multiple strings", function () {
  expect(concat("foo", "bar", "baz")).toEqual("foobarbaz");
});