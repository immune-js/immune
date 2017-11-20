import
  { every
  } from "../../../index"

test("it returns true for empty arrays", () => {
  expect(every([], v => v === 2)).toEqual(true)
})

test("it returns true if all of the values satisfies a predicate", () => {
  expect(every([1, 2], v => v === 1 || v === 2)).toEqual(true)
})

test("it returns false if only some values match", () => {
  expect(every([1, 2, 3], v => v === 2)).toEqual(false)
})

test("it returns false if the last value matches but earlier did not", () => {
  expect(every([1, 2, 3], v => v === 3)).toEqual(false)
})