import
  { Stream
  } from "../../"

export const eventStream = (getEl, type, action) => {
  let callback
  return Stream.create(
    { start : listener => {
        callback = evt => listener.next(action(evt))
        getEl().addEventListener(type, callback)
      }
    , stop  : () =>
        getEl().removeEventListener(type, callback)
    }
  )
}