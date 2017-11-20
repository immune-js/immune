import
  { Ok
  , Err
  , fold
  } from "../../../"

test("given a Ok it should apply the first function with the success value and return the result", () => {
  expect(fold(Ok(2), x => x + 2, () => -1)).toEqual(4)
})

test("given a Ok and the first argument is not a function then just return the value", () => {
  expect(fold(Ok(2), 4, err => -1)).toEqual(4)
})

test("given a Err it should apply the second function with the eroor value and return the result", () => {
  expect(fold(Err("no can do"), x => x + 2, err => err + "!!!")).toEqual("no can do!!!")
})

test("given a Err and the second argument is not a function then just return the value", () => {
  expect(fold(Err(2), x => x + 2, -1)).toEqual(-1)
})