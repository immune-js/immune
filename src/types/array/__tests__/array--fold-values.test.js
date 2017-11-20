import
  { foldValues
  } from "../../.."

test("it should act the same way as foldl does", () => {
  expect(foldValues([1, 2, 3], 0, (acc, v) => acc + v)).toEqual(6)
})