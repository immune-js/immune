import
  { Task
  } from "../.."

export const table = (...msgs) =>
  Task((_, succeed) => (console.table(...msgs), succeed()))

export const info = (...msgs) =>
  Task((_, succeed) => (console.info(...msgs), succeed()))

export const log = (...msgs) =>
  Task((_, succeed) => (console.log(...msgs), succeed()))

export const warn = (...msgs) =>
  Task((_, succeed) => (console.warn(...msgs), succeed()))

export const error = (...msgs) =>
  Task((_, succeed) => (console.error(...msgs), succeed()))

export default { table, log, info, warn, error }