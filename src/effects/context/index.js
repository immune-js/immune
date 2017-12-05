import
  { Task
  , None
  , fold
  } from "../.."

export const isServer = ctx =>
  fold(ctx, _ => true, () => false)

export const ifServer = (ctx, f) =>
  fold(ctx, f, Task.none)

export const isClient = ctx =>
  fold(ctx, _ => false, () => true)

export const ifClient = (ctx, f) =>
  fold(ctx, _ => Task.none, f)

export const setStatus = (context, status) => (
  console.log("ctx: ", context, "status:", status),
  ifServer(context, ctx =>
    (console.log("ctxx:", ctx), Task((fail, succeed) => (ctx.status = status, succeed(context))))
  )
)

export const setTitle = (context, title) =>
  fold(context, 
    ctx => Task((fail, succeed) => (console.log("ctxxx:", ctx), ctx.state.title = title, succeed())),
    ( ) => Task((fail, succeed) => (document.title  = title, succeed()))
  )

export default 
  { isServer
  , ifServer
  , isClient
  , ifClient
  , setStatus
  , setTitle
  }