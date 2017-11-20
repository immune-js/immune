import { Maybe, Result, show } from "../../..";

test("it should transform an Ok into a Some", function () {
  expect(show(Maybe.fromResult(Result.Ok(2)))).toBe("Maybe.Some(2)");
});

test("it should transform an Err into a None", function () {
  expect(show(Maybe.fromResult(Result.Err("err")))).toBe("Maybe.None()");
});