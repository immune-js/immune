import 
  { mapKV
  } from "../../../index"

test("it returns a new object from the result of applying a function to each of it's keys and values", () => {
  expect(mapKV({ x: 1, y: 2 }, ([k, v]) => [k, v])).toEqual([["x", 1], ["y", 2]])
})

test("it is non-destructive", () => {
  let obj = { x: 1, y: 2 }
  mapKV(obj, ([k, v]) => [k, v])
  expect(obj).toEqual({ x: 1, y: 2 })
})

test("it does nothing for empty objects", () => {
  expect(mapKV({}, ([k, v]) => [k ,v])).toEqual([])
})