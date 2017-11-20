import 
  { show
  } from '../../../index'

test("it returns a string representation of simple objects", () => {
  expect(show({ x: 1, y: 2 })).toBe('{ x: 1, y: 2 }')
})

test("it recursively stringifies nested objects", () => {
  expect(show({ x: { y: "1", z: "2" } })).toBe('{ x: { y: "1", z: "2" } }')
})