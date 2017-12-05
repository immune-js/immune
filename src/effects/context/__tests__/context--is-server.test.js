import
  { Some
  , None
  } from "../../.."

import Context from "../"

test("it should return true if given a context", () => {
  expect(Context.isServer(Some({ the: "context" }))).toBe(true)
})

test("it should return false if not given a context", () => {
  expect(Context.isServer(None())).toBe(false)
})