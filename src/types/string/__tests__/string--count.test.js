import
  { count
  } from "../../.."
  
test("it should return the length of a string", () => {
  expect(count("foobar")).toBe(6)
})