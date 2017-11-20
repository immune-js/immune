import
  { dissocIn
  } from "../../.."
  

test("it should dissassociate a deeply nested value", () => {
  expect(dissocIn({ x: { y: [1, 2, 3] } }, ['x', 'y'])).toEqual({ x: { } })
})
