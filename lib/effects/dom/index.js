import { Task, andThen } from "../..";

export var querySelector = function querySelector(selector) {
  return Task(function (fail, succeed) {
    var node = document.querySelector(selector);
    node ? succeed(node) : fail("Unable to find a node corresponding to the selector " + selector);
  });
};

export var querySelectorAll = function querySelectorAll(selector) {
  return Task(function (fail, succeed) {
    return succeed(document.querySelectorAll(selector));
  });
};

export var focus = function focus(node) {
  return andThen(node, function (node) {
    return Task(function (fail, succeed) {
      return node.focus(), succeed();
    });
  });
};

export var focusSelector = function focusSelector(selector) {
  return focus(querySelector(selector));
};

export default { querySelector: querySelector, querySelectorAll: querySelectorAll, focus: focus, focusSelector: focusSelector };