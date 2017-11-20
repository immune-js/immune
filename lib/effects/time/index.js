import { Type, Task } from "../..";

export var sleep = function sleep(ms, success) {
  return Task.perform(Task(function (fail, succeed) {
    return setTimeout(function () {
      return succeed(2);
    }, ms);
  }), success, success);
};

export var now = function now(msg) {
  return Task.perform(Task(function (_, succeed) {
    var date = new Date();
    succeed(Time(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
  }), msg, msg);
};

export var Time = Type("Time", { hour: Number,
  minute: Number,
  second: Number,
  millisecond: Number
});

Time.sleep = sleep;
Time.now = now;

export default Time;