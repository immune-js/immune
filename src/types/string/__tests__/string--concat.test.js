import
  { concat
  } from "../../.."

test("it should concatenate two strings", () => {
  expect(concat("foo", "bar")).toEqual("foobar")
})

test("it should concatenate multiple strings", () => {
  expect(concat("foo", "bar", "baz")).toEqual("foobarbaz")
})