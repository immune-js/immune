var _parse$capture$captur;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import parser from "./parse";

import { push, listen as historyListen } from "../history";

import { Task, Stream } from "../..";

export var parse = parser;
export var listen = historyListen;
export var navigateTo = push;

export var capture = function capture(attribute) {
  var evtListener = void 0;

  return Stream.create({ start: function start(listener) {
      evtListener = function evtListener(e) {
        if (e.target.tagName === "A" && e.target.getAttribute(attribute) === "true") {
          e.preventDefault();
          push(e.target.pathname).fork(function () {}, function () {});
        }
      };
      document.addEventListener("click", evtListener);
    },
    stop: function stop() {
      return document.removeEventListener("click", evtListener);
    }
  });
};

export default (_parse$capture$captur = { parse: parse, capture: capture }, _defineProperty(_parse$capture$captur, "capture", capture), _defineProperty(_parse$capture$captur, "listen", listen), _defineProperty(_parse$capture$captur, "navigateTo", navigateTo), _parse$capture$captur);