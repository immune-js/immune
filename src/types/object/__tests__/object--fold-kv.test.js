import
  { conj
  , foldKV
  } from "../../.."

test("it should pass both the index and value to the transformation function", () => {
  expect(foldKV({ x: 1, y: 2, z: 3 }, [], (acc, [k, v]) => conj(acc, [k, v])))
    .toEqual([["x", 1], ["y", 2], ["z", 3]])
})