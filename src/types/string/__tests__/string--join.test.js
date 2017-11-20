import
  { join
  } from "../../.."

test("it should insert a separator between each character in the string", () => {
  expect(join("foobar", ", ")).toBe("f, o, o, b, a, r")
})