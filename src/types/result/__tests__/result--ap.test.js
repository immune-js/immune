import
  { Ok
  , Err
  , ap
  , caseOf
  , equals
  , show
  } from "../../../index"

test("it should apply the value in one Ok to a function in another Ok", () => {
  expect(
    equals(ap(Ok(x => x + 2), Ok(4)), Ok(6))
  ).toBe(true)
})

test("it should return Err if the first argument is Err", () => {
  expect(
    equals(ap(Err("error!"), Ok(4)), Err("error!"))
  ).toBe(true)
})

test("it should return Err if the second argument is Err", () => {
  expect(
    equals(ap(Ok(x => x + 2), Err("error!")), Err("error!"))
  ).toBe(true)
})

test("it should return Err if both arguments are Err", () => {
  expect(
    equals(ap(Err("error!"), Err("error!")), Err("error!"))
  ).toBe(true)
})