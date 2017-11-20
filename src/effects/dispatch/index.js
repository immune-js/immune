import
  { Task
  } from "../.."

export default msg =>
  Task((_, succeed) => succeed(msg))