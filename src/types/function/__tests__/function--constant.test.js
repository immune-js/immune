import
  { constant
  } from "../../.."

test("it returns a function that always returns the same value no matter what it's called with", () => {
  expect(constant(  2  )("foo")).toBe(  2  )
  expect(constant("foo")(  2  )).toBe("foo")
})