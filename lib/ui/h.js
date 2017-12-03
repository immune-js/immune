var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { flatten } from "../";

import { h as picodomH } from "picodom";

import { Component } from "./component";

export default (function (sel, props, children) {
  if (sel == null) return { tag: null, data: {}, children: [] };

  if (children == null) {
    if (Array.isArray(props) || typeof (props || {}).tag === "string" || typeof props === "string" || typeof (props || {}).tag === "number" || props && props instanceof Component) {
      children = props;
      props = {};
    } else {
      children = [];
      props = props || {};
    }
  }

  if (!Array.isArray(children)) children = [children];

  children = flatten(children.map(function (child) {
    return typeof child === "number" ? child.toString() : child;
  }));

  var node = sel.match(/^[a-zA-Z0-9\-\_]+/)[0];
  var classes = (sel.match(/\.[a-zA-Z0-9\-\_]+/g) || []).map(function (cls) {
    return cls.slice(1);
  });

  var _ref = sel.match(/\#[a-zA-Z0-9\-\_]+/) || [],
      _ref2 = _slicedToArray(_ref, 1),
      id = _ref2[0];

  var attrs = (sel.match(/\[\s*[a-zA-Z0-9\-\_]+\s*\=\s*(\"|\')?[a-zA-Z0-9\$\#\-\_\s]+(\"|\')?\s*\]/g) || []).reduce(function (acc, kvp) {
    if (kvp == null) return acc;

    var _kvp$slice$split = kvp.slice(1, kvp.length - 1).split(/\s*\=\s*/),
        _kvp$slice$split2 = _slicedToArray(_kvp$slice$split, 2),
        key = _kvp$slice$split2[0],
        val = _kvp$slice$split2[1];

    acc[key] = val.replace(/(\'|\")/g, "");
    return acc;
  }, {});

  if (id) props.id = id.slice(1);

  if (classes && classes.length) {
    props["class"] = props["class"] ? props["class"] + (" " + classes.join(' ')) : classes.join(' ');
  }

  return picodomH(node, Object.assign({}, props, attrs), children);
});