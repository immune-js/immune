import
  { every
  } from "../../../index"

test("it returns true for empty strings", () => {
  expect(every("", v => v === "a")).toEqual(true)
})

test("it returns true if all of the characters satisfies a predicate", () => {
  expect(every("bar", v => v === "b" || v === "a" || v === "r")).toEqual(true)
})

test("it returns false if only some characters match", () => {
  expect(every("bar", v => v === "a")).toEqual(false)
})

test("it returns false if the last character matches but earlier did not", () => {
  expect(every("bar", v => v === "r")).toEqual(false)
})