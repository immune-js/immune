import
  { Task
  , Some
  , None
  } from "../../.."

import Context from "../"

test("it should return the task if given a context", done => {
  Context.ifServer(Some({ the: "context" }), ctx => Task.of("server!")).fork(err => {}, msg => (expect(msg).toBe("server!"), done()))
})

test("it should pass the context", done => {
  const contextValue = { the: "context" }
  Context.ifServer(Some(contextValue), ctx => Task.of(ctx)).fork(err => {}, ctx => (expect(ctx).toBe(contextValue), done()))
})

test("it should return Task.none if not given a context", () => {
  expect(Context.ifServer(None(), Task.of("server!"))).toBe(Task.none)
})