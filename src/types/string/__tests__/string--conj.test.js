import
  { conj
  } from "../../.."

test("it should add a char to the end of the string", () => {
  expect(conj("ba", "r")).toEqual("bar")
})

test("it should add multiple chars to the end of the string", () => {
  expect(conj("foo", "b", "a", "r")).toEqual("foobar")
})