import
  { foldr
  } from "../../.."

test("it should fold an object to a value starting from the right hand side", () => {
  expect(foldr({ x: 1, y: 2, z: 3 }, [], (acc, [k, v]) => acc.concat(v))).toEqual([3, 2, 1])
})