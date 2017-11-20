import
  { Ok
  , Err
  , andThen
  , equals
  } from "../../.."

test("it should map a function over a Some and flatten the result", () => {
  expect(
    equals(andThen(Ok(2), x => Ok(x + 4)), Ok(6))
  ).toBe(true)
})

test("it should return Err when invoked over Err", () => {
  expect(
    equals(andThen(Err("error!"), x => Ok(x + 4)), Err("error!"))
  ).toBe(true)
})

test("it should return Err if the function returns Err", () => {
  expect(
    equals(andThen(Ok(2), x => Err("error!")), Err("error!"))
  ).toBe(true)
})