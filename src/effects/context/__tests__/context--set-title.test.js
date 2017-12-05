import
  { Task
  , Some
  , None
  , getOrElse
  } from "../../.."

import Context from "../"

test("it should set the title field of the context if a context is provided", done => {
  let ctx = { state: {} }
  Context.setTitle(Some(ctx), "Hello, world!").fork(
    err => {},
    _   => {
      expect(ctx.state.title).toBe("Hello, world!")
      done()
    }
  )
})

test("it should set the status field of the document if no context is provided", () => {
  let ctx = { state: {} }
  Context.setStatus(None(), "Hello, world").fork(
    () => {},
    _  => {
      expect( ctx.state.title ).toBe("")
      expect( document.title  ).toBe("Hello, world!")
    }
  )
})
