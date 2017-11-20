import { Task } from "../../..";

test("it transforms a task into a promise", function () {
  expect(Task.toPromise(Task.of(2)) instanceof Promise).toBe(true);
});