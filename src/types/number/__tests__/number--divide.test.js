import
  { show
  , divide
  } from "../../.."

test("it should divide two numbers", () => {
  expect(show(divide(6, 2))).toBe("Result.Ok(3)")
})

test("it should return an error when attempting to divide by zero", () => {
  expect(show(divide(6, 0))).toBe('Result.Err("division by zero is undefined")')
})