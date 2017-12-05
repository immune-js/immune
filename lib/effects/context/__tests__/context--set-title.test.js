import { Task, Some, None, getOrElse } from "../../..";

import Context from "../";

test("it should set the title field of the context if a context is provided", function (done) {
  var ctx = { state: {} };
  Context.setTitle(Some(ctx), "Hello, world!").fork(function (err) {}, function (_) {
    expect(ctx.state.title).toBe("Hello, world!");
    done();
  });
});

test("it should set the status field of the document if no context is provided", function () {
  var ctx = { state: {} };
  Context.setStatus(None(), "Hello, world").fork(function () {}, function (_) {
    expect(ctx.state.title).toBe("");
    expect(document.title).toBe("Hello, world!");
  });
});