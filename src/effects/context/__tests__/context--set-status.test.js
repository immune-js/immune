import
  { Task
  , Some
  , None
  , getOrElse
  } from "../../.."

import Context from "../"

test("it should set the status field of the context if a context is provided", done => {
  let ctx = { status: 200 }
  Context.setStatus(Some(ctx), 404).fork(
    err => {},
    _   => {
      expect(ctx.status).toBe(404)
      done()
    }
  )
})

test("it should not set the status field of the context object if no context is provided", () => {
  let ctx = { status: 200 }
  expect(Context.setStatus(None(), 404)).toBe(Task.none)
  expect(ctx.status).toBe(200)
})
