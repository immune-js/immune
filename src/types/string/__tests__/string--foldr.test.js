import
  { foldr
  } from "../../.."

test("it should fold an array to a value from the right", () => {
  expect(foldr("foobar", "", (acc, v) => acc + v)).toEqual("raboof")
})