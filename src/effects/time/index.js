import 
  { Type
  , Task
  } from "../.."

export const sleep = (ms, success) =>
  Task.perform(Task((fail, succeed) => setTimeout(() => succeed(2), ms)), success, success)

export const now = msg =>
  Task.perform(Task((_, succeed) => {
    const date = new Date()
    succeed(Time(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()))
  }), msg, msg)


export const Time = Type("Time",
  { hour        : Number
  , minute      : Number
  , second      : Number
  , millisecond : Number
  }
)

Time.sleep = sleep
Time.now   = now

export default Time