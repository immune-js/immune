import
  { count
  } from "../../.."
  
test("it should return the length of an object", () => {
  expect(count({ x: 1, y: 2, z: 3 })).toBe(3)
})