import
  { Result
  , show
  } from "../../.."

test("it should convert Ok into Some", () => {
  expect(show(Result.toMaybe(Result.Ok(2)))).toEqual("Maybe.Some(2)")
})

test("it should convert Err into None", () => {
  expect(show(Result.toMaybe(Result.Err("err")))).toEqual("Maybe.None()")
})