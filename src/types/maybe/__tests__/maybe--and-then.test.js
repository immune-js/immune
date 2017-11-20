import
  { Some
  , None
  , andThen
  , equals
  } from "../../.."

test("it should map a function over a Some and flatten the result", () => {
  expect(
    equals(andThen(Some(2), x => Some(x + 4)), Some(6))
  ).toBe(true)
})

test("it should return None when invoked over None", () => {
  expect(
    equals(andThen(None(), x => Some(x + 4)), None())
  ).toBe(true)
})

test("it should return None if the function returns None", () => {
  expect(
    equals(andThen(Some(2), x => None()), None())
  ).toBe(true)
})