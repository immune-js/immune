import
  { some
  } from "../../../index"
  
test("it returns false for empty objects", () => {
  expect(some({}, ([k, v]) => v === 2)).toEqual(false)
})

test("it returns true if at least one of the values satisfies a predicate", () => {
  expect(some({ x: 1, y: 2 }, ([k, v]) => v === 2)).toEqual(true)
})

test("it returns true even if folowing values return false", () => {
  expect(some({ x: 1, y: 2, z: 3 }, ([k, v]) => v === 2)).toEqual(true)
})

test("it returns true if multiple values satisfies a predicate", () => {
  expect(some({ x: 1, y: 2, z: 3 }, ([k, v]) => v === 1 || v === 2)).toEqual(true)
})

test("it returns false if at none of the values satisfies a predicate", () => {
  expect(some({ x: 1, y: 2, z: 3 }, ([k, v]) => v === 10)).toEqual(false)
})