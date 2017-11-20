import
  { filter
  } from "../../.."

test("it should return a new string containing only the items that satisfies a predicate", () => {
  expect(filter("foobar", x => x === "o")).toEqual("oo")
})