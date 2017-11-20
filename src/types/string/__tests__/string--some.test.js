import
  { some
  } from "../../../index"
  
test("it returns false for empty strings", () => {
  expect(some("", v => v === "a")).toEqual(false)
})

test("it returns true if at least one of the characters satisfies a predicate", () => {
  expect(some("bar", v => v === "r")).toEqual(true)
})

test("it returns true even if folowing values return false", () => {
  expect(some("bar", v => v === "a")).toEqual(true)
})

test("it returns true if multiple values satisfies a predicate", () => {
  expect(some("foobar", v => v === "o" || v === "b")).toEqual(true)
})

test("it returns false if at none of the values satisfies a predicate", () => {
  expect(some("bar", v => v === "f")).toEqual(false)
})