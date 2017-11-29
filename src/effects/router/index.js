import parser from "./parse"

import
  { push
  , listen as historyListen
  } from "../history"

import
  { Task
  , Stream
  } from "../.."

export const parse      = parser
export const listen     = historyListen
export const navigateTo = push

export const capture = attribute => {
  let evtListener
  
  return Stream.create(
    { start : listener => {
        evtListener = e => {
          if (e.target.tagName === "A" && e.target.getAttribute(attribute) === "true") {
            e.preventDefault()
            push(e.target.pathname).fork(() => {}, () => {})
          }
        }
        document.addEventListener("click", evtListener)
      }
    , stop: () =>
        document.removeEventListener("click", evtListener)
    }
  )
}

export default { parse, capture, capture, listen, navigateTo }