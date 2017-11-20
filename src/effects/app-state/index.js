import 
  { Task
  , Stream
  , getIn
  , fold
  } from "../.."

import AppState from "../../ui/app-state"

export const read = (path = []) =>
  Task((fail, succeed) => 
    fold(getIn(AppState.state, path), succeed, fail)
  )

export const stream = (function (unlisten) {
  return Stream.createWithMemory(
    { start : listener =>
        unlisten = AppState.subscribe(state => listener.next(state))
    , stop  : unlisten
    }
  )
})(undefined)

export default { read, stream }