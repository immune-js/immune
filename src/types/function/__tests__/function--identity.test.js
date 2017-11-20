import
  { identity
  } from "../../.."

test("it always returns the value it's given", () => {
  expect(identity(2)).toBe(2)
  expect(identity("foo")).toBe("foo")
})