import
  { add
  } from "../../.."

test("it should return the sum of two numbers", () => {
  expect(add(2, 4)).toBe(6)
})