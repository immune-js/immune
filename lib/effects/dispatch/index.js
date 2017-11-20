import { Task } from "../..";

export default (function (msg) {
  return Task(function (_, succeed) {
    return succeed(msg);
  });
});