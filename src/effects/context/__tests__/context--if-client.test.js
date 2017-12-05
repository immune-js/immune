import
  { Task
  , Some
  , None
  } from "../../.."

import Context from "../"

test("it should return Task.none if given a context", () => {
  expect(Context.ifClient(Some({ the: "context" }), () => Task.of("client!"))).toBe(Task.none)
})

test("it should return the task if not given a context", done => {
  Context.ifClient(None(), () => Task.of("client!")).fork(err => {}, msg => (expect(msg).toBe("client!"), done()))
})