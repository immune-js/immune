import
  { Task
  , andThen
  } from "../.."

export const querySelector = selector =>
  Task((fail, succeed) => {
    const node = document.querySelector(selector)
    node ? succeed(node) : fail(`Unable to find a node corresponding to the selector ${selector}`)
  })

export const querySelectorAll = selector =>
  Task((fail, succeed) => succeed(document.querySelectorAll(selector)))

export const focus = node =>
  andThen(node, node => Task((fail, succeed) => (node.focus(), succeed())))

export const focusSelector = selector =>
  focus(querySelector(selector))

export default { querySelector, querySelectorAll, focus, focusSelector }