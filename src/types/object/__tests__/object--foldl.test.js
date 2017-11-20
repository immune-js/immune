import
  { foldl
  } from "../../.."

test("it should fold an object to a value from the left", () => {
  expect(foldl({ x: 1, y: 2, z: 3 }, [], (acc, [k, v]) => acc.concat(v))).toEqual([1, 2, 3])
})