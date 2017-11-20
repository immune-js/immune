import 
  { mapKeys
  } from "../../../index"

test("it returns a new object from the result of applying a function to each of it's keys", () => {
  expect(mapKeys({ x: 1, y: 2 }, k => k)).toEqual(["x", "y"])
})

test("it is non-destructive", () => {
  let obj = { x: 1, y: 2 }
  mapKeys(obj, k => k)
  expect(obj).toEqual({ x: 1, y: 2 })
})

test("it returns an empty array given an empty object", () => {
  expect(mapKeys({}, k => k)).toEqual([])
})