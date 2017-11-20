import
  { foldl
  } from "../../.."

test("it should fold an array to a value from the left", () => {
  expect(foldl("foobar", "", (acc, v) => acc + v)).toEqual("foobar")
})