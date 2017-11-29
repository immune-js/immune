import parser from "./parse";

import { push, listen as historyListen } from "../history";

import { Task, Stream } from "../..";

export var parse = parser;

export var captureLinks = function captureLinks(prop) {
  return Task(function () {
    document.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && e.target.getAttribute(prop) === "true") {
        e.preventDefault();
        push(e.target.pathname).fork(function () {}, function () {});
      }
    });
  });
};

export var capture = function capture(attribute) {
  var evtListener = void 0;

  return Stream.create({ start: function start(listener) {
      evtListener = function evtListener(e) {
        if (e.target.tagName === "A" && e.target.getAttribute(attribute) === "true") {
          e.preventDefault();
          push(e.target.pathname).fork(function () {}, function () {});
          // listener.next(e.target.pathname)
        }
      };
      document.addEventListener("click", evtListener);
    },
    stop: function stop() {
      return document.removeEventListener("click", evtListener);
    }
  });
};

export var listen = historyListen;

export var navigateTo = push;

export default { parse: parse, captureLinks: captureLinks, capture: capture, listen: listen, navigateTo: navigateTo };