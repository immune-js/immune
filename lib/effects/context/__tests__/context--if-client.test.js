import { Task, Some, None } from "../../..";

import Context from "../";

test("it should return Task.none if given a context", function () {
  expect(Context.ifClient(Some({ the: "context" }), function () {
    return Task.of("client!");
  })).toBe(Task.none);
});

test("it should return the task if not given a context", function (done) {
  Context.ifClient(None(), function () {
    return Task.of("client!");
  }).fork(function (err) {}, function (msg) {
    return expect(msg).toBe("client!"), done();
  });
});