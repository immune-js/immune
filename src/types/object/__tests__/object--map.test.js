import 
  { map
  } from "../../../index"

test("it returns a new object from the result of applying a function to each of it's values", () => {
  expect(map({ x: 1, y: 2 }, ([k, v]) => v + 1)).toEqual([2, 3])
})

test("it is non-destructive", () => {
  let obj = { x: 1, y: 2 }
  map(obj, ([k, v]) => v + 1)
  expect(obj).toEqual({ x: 1, y: 2 })
})

test("it does nothing for empty objects", () => {
  expect(map({}, ([k, v]) => v + 1)).toEqual([])
})

test("it should curry the mapping function", () =>
  expect(map(map({ x: 1, y: 2, z: 3 }, ([k1, x], y) => x + y), f => f(4))).toEqual([ 5, 6, 7 ])
)