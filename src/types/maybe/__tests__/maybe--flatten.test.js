import
  { Some
  , None
  , equals
  , flatten
  } from "../../../"

test("it should extract the inner Some from a nested Some", () => {
  expect(
    equals(flatten(Some(Some(2))), Some(2))
  ).toBe(true)
})

test("it should return None if none is wrapped inside the Some", () => {
  expect(
    equals(flatten(Some(None())), None())
  ).toBe(true)
})

test("it should return None if called on a None", () => {
  expect(
    equals(flatten(None()), None())
  ).toBe(true)
})