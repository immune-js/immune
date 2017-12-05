import { Task, None, fold } from "../..";

export var isServer = function isServer(ctx) {
  return fold(ctx, function (_) {
    return true;
  }, function () {
    return false;
  });
};

export var ifServer = function ifServer(ctx, f) {
  return fold(ctx, f, Task.none);
};

export var isClient = function isClient(ctx) {
  return fold(ctx, function (_) {
    return false;
  }, function () {
    return true;
  });
};

export var ifClient = function ifClient(ctx, f) {
  return fold(ctx, function (_) {
    return Task.none;
  }, f);
};

export var setStatus = function setStatus(context, status) {
  return console.log("ctx: ", context, "status:", status), ifServer(context, function (ctx) {
    return console.log("ctxx:", ctx), Task(function (fail, succeed) {
      return ctx.status = status, succeed(context);
    });
  });
};

export var setTitle = function setTitle(context, title) {
  return fold(context, function (ctx) {
    return Task(function (fail, succeed) {
      return console.log("ctxxx:", ctx), ctx.state.title = title, succeed();
    });
  }, function () {
    return Task(function (fail, succeed) {
      return document.title = title, succeed();
    });
  });
};

export default { isServer: isServer,
  ifServer: ifServer,
  isClient: isClient,
  ifClient: ifClient,
  setStatus: setStatus,
  setTitle: setTitle
};