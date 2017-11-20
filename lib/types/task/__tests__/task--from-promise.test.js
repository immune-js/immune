import { Task, Result, map, ap, andThen, flatten } from "../../..";

test("it transforms a promise into a task", function () {
  expect(Task.fromPromise(Promise.resolve(2)) instanceof Task).toBe(true);
});