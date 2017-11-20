import
  { some
  } from "../../../index"
  
test("it returns false for empty arrays", () => {
  expect(some([], v => v === 2)).toEqual(false)
})

test("it returns true if at least one of the values satisfies a predicate", () => {
  expect(some([1, 2], v => v === 2)).toEqual(true)
})

test("it returns true even if folowing values return false", () => {
  expect(some([1, 2, 3], v => v === 2)).toEqual(true)
})

test("it returns true if multiple values satisfies a predicate", () => {
  expect(some([1, 2, 3], v => v === 1 || v === 2)).toEqual(true)
})

test("it returns false if at none of the values satisfies a predicate", () => {
  expect(some([1, 2, 3], v => v === 10)).toEqual(false)
})