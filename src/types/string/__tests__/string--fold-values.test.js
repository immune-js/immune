import
  { foldValues
  } from "../../.."

test("it should act the same way as foldl does", () => {
  expect(foldValues("foobar", "", (acc, v) => acc + v)).toEqual("foobar")
})