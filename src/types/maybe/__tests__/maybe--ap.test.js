import
  { Some
  , None
  , ap
  , caseOf
  , equals
  , show
  } from "../../../index"

test("it should apply the value in one Some to a function in another Some", () => {
  expect(
    equals(ap(Some(x => x + 2), Some(4)), Some(6))
  ).toBe(true)
})

test("it should return None if the first argument is None", () => {
  expect(
    equals(ap(None(), Some(4)), None())
  ).toBe(true)
})

test("it should return None if the second argument is None", () => {
  expect(
    equals(ap(Some(x => x + 2), None()), None())
  ).toBe(true)
})

test("it should return None if both arguments are None", () => {
  expect(
    equals(ap(None(), None()), None())
  ).toBe(true)
})