function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var walk = function walk(node, map) {
  return map(node.tagName.toLowerCase(), node ? [].concat(_toConsumableArray(node.childNodes)).map(function (node) {
    return node.nodeType === Node.TEXT_NODE ? node.nodeValue.trim() && node.nodeValue : walk(node, map);
  }) : node);
};

var toVDOM = function toVDOM(element) {
  return walk(element, function (nodeName, children) {
    return { tag: nodeName, data: {}, children: children };
  });
};

export default (function (element) {
  var firstChild = element.children[0];

  return { element: firstChild, oldNode: firstChild ? toVDOM(firstChild) : firstChild };
});