import
  { Some
  , None
  , fold
  } from "../../../"

test("given a Some it should apply the first function with the wrapped value and return the result", () => {
  expect(fold(Some(2), x => x + 2, () => -1)).toEqual(4)
})

test("given a Some and the first argument is not a function then just return the value", () => {
  expect(fold(Some(2), 4, () => -1)).toEqual(4)
})

test("given a None it should apply the second function and return the result", () => {
  expect(fold(None(), x => x + 2, () => -1)).toEqual(-1)
})

test("given a None and the second argument is not a function then just return the value", () => {
  expect(fold(None(), x => x + 2, -1)).toEqual(-1)
})