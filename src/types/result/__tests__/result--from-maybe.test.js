import
  { Result
  , Maybe
  , show
  } from "../../.."

test("it should convert Some into Ok", () => {
  expect(show(Result.fromMaybe(Maybe.Some(2), "err"))).toEqual("Result.Ok(2)")
})

test("it should convert Err into None", () => {
  expect(show(Result.fromMaybe(Maybe.None(), "err"))).toEqual('Result.Err("err")')
})