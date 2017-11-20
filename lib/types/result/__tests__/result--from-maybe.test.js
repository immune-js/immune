import { Result, Maybe, show } from "../../..";

test("it should convert Some into Ok", function () {
  expect(show(Result.fromMaybe(Maybe.Some(2), "err"))).toEqual("Result.Ok(2)");
});

test("it should convert Err into None", function () {
  expect(show(Result.fromMaybe(Maybe.None(), "err"))).toEqual('Result.Err("err")');
});