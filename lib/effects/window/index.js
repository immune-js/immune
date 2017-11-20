import { Type, Task, Stream, map } from "../..";

import { eventStream } from "../../utils/event-stream";

export var Window = Type("Window", { dimensions: { inner: { width: Number, height: Number },
    outer: { width: Number, height: Number }
  },
  scroll: { x: Number, y: Number }
});

var createWindow = function createWindow(window) {
  return Window({ inner: { width: window.innerWidth, height: window.innerHeight },
    outer: { width: window.outerWidth, height: window.outerHeight }
  }, { x: window.scrollX, y: window.scrollY });
};

Window.resize = function (msg) {
  return map(eventStream(function () {
    return window;
  }, "resize", function (e) {
    return createWindow(e.target);
  }), msg);
};

Window.scroll = function (msg) {
  return map(eventStream(function () {
    return window;
  }, "scroll", function (e) {
    return createWindow(window);
  }), msg);
};

Window.getWindow = function (msg) {
  return Task.perform(Task(function (_, succeed) {
    return succeed(createWindow(window));
  }), function () {}, msg);
};

export var resize = Window.resize;
export var scroll = Window.scroll;
export var getWindow = Window.getWindow;

export default Window;