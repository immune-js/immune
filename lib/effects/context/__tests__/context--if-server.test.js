import { Task, Some, None } from "../../..";

import Context from "../";

test("it should return the task if given a context", function (done) {
  Context.ifServer(Some({ the: "context" }), function (ctx) {
    return Task.of("server!");
  }).fork(function (err) {}, function (msg) {
    return expect(msg).toBe("server!"), done();
  });
});

test("it should pass the context", function (done) {
  var contextValue = { the: "context" };
  Context.ifServer(Some(contextValue), function (ctx) {
    return Task.of(ctx);
  }).fork(function (err) {}, function (ctx) {
    return expect(ctx).toBe(contextValue), done();
  });
});

test("it should return Task.none if not given a context", function () {
  expect(Context.ifServer(None(), Task.of("server!"))).toBe(Task.none);
});