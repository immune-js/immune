import
  { Maybe
  , Result
  , show
  } from "../../.."

test("it should transform an Ok into a Some", () => {
  expect(show(Maybe.fromResult(Result.Ok(2)))).toBe("Maybe.Some(2)")
})

test("it should transform an Err into a None", () => {
  expect(show(Maybe.fromResult(Result.Err("err")))).toBe("Maybe.None()")
})