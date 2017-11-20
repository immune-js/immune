import 
  { Type
  , Task
  , Stream
  , map
  } from "../.."

import
  { eventStream
  } from "../../utils/event-stream"

export const Window = Type("Window",
  { dimensions : 
      { inner: { width : Number, height : Number }
      , outer: { width : Number, height : Number } 
      }
  , scroll : { x : Number, y : Number }
  }
)

const createWindow = window =>
  Window
    ( { inner: { width: window.innerWidth, height: window.innerHeight }
      , outer: { width: window.outerWidth, height: window.outerHeight }
      }
    , { x: window.scrollX, y: window.scrollY }
    )

Window.resize = msg => 
  map(eventStream(() => window, "resize", e => createWindow(e.target)), msg)

Window.scroll = msg =>
  map(eventStream(() => window, "scroll", e => createWindow(window  )), msg)

Window.getWindow = msg =>
  Task.perform(Task((_, succeed) => succeed(createWindow(window))), () => {}, msg)

export const resize    = Window.resize
export const scroll    = Window.scroll
export const getWindow = Window.getWindow

export default Window