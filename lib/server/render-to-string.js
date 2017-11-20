var renderToString = function renderToString(vnode) {
  var tag = vnode.tag;
  var children = vnode.children;
  var attrNames = Object.keys(vnode.data);

  var attrs = "";
  for (var i in attrNames) {
    var currentAttrName = attrNames[i];
    var content = currentAttrName == "style" ? stringifyStyle(vnode.data[currentAttrName]) : vnode.data[currentAttrName];

    attrs += " " + currentAttrName + '="' + content + '"';
  }

  var childHTML = "";
  for (var _i in children) {
    var child = children[_i];
    if (child.tag) childHTML += renderToString(child);
    if (typeof child == "string") childHTML += child;
  }

  return "<" + tag + attrs + ">" + childHTML + "</" + tag + ">";
};

function stringifyStyle(style) {
  var properties = Object.keys(style);
  var inlineStyle = "";
  for (var i in properties) {
    var curProp = properties[i];
    inlineStyle += curProp.replace(/[A-Z]/g, "-$&").toLowerCase() + ":" + style[curProp] + ";";
  }

  return inlineStyle;
}

export default renderToString;