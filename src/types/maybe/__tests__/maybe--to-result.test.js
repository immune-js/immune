import
  { Maybe
  , Result
  , show
  } from "../../.."

test("it should transform an Ok into a Some", () => {
  expect(show(Maybe.toResult(Maybe.Some(2), "err"))).toBe("Result.Ok(2)")
})

test("it should transform an Err into a None", () => {
  expect(show(Maybe.toResult(Maybe.None(), "err"))).toBe('Result.Err("err")')
})