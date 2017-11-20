import
  { foldValues
  } from "../../.."

test("it should always pass only the value not key/value pair as foldl does", () => {
  expect(foldValues({ x: 1, y: 2, z: 3 }, 0, (acc, v) => acc + v)).toEqual(6)
})