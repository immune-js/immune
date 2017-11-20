import
  { every
  } from "../../../index"

test("it returns true for empty objects", () => {
  expect(every({}, ([k, v]) => v === 2)).toEqual(true)
})

test("it returns true if all of the values satisfies a predicate", () => {
  expect(every({ x: 1, y: 2 }, ([k, v]) => v === 1 || v === 2)).toEqual(true)
})

test("it returns false if only some values match", () => {
  expect(every({ x: 1, y: 2, z: 3 }, ([k, v]) => v === 2)).toEqual(false)
})

test("it returns false if the last value matches but earlier did not", () => {
  expect(every({ x: 1, y: 2, z: 3 }, ([k, v]) => v === 3)).toEqual(false)
})