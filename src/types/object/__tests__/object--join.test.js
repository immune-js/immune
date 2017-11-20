import
  { join
  } from "../../.."

test("it should stringify the object values and join them together with a separator in between", () => {
  expect(join({ x: 1, y: 2, z: 3 }, " + ")).toBe("1 + 2 + 3")
  expect(join({ x: [1, 2], y: [3, 4], z: [5, 6] }, ", ")).toBe("[ 1, 2 ], [ 3, 4 ], [ 5, 6 ]")
})
