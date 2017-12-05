import { Some, None } from "../../..";

import Context from "../";

test("it should return false if given a context", function () {
  expect(Context.isClient(Some({ the: "context" }))).toBe(false);
});

test("it should return true if not given a context", function () {
  expect(Context.isClient(None())).toBe(true);
});