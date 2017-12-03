import
  { flatten
  } from "../"

import 
  { h as picodomH 
  } from "picodom"

import 
  { Component
  } from "./component"

export default (sel, props, children) => {
  if (sel == null)
    return { tag: null, data: {}, children: [] }
  
  if (children == null) {
    if (Array.isArray(props) || typeof((props || {}).tag) === "string" || typeof(props) === "string" || typeof((props || {}).tag) === "number" || (props && props instanceof Component)) {
      children = props
      props    = {}
    } else {
      children = []
      props    = props || {}
    }
  }
  
  if (!Array.isArray(children))
    children = [children]
  
  children = flatten(children.map(child => typeof(child) === "number" ? child.toString() : child))
  
  const node    = sel.match(/^[a-zA-Z0-9\-\_]+/)[0]
  const classes = (sel.match(/\.[a-zA-Z0-9\-\_]+/g) || []).map(cls => cls.slice(1))
  const [id]    = sel.match(/\#[a-zA-Z0-9\-\_]+/) || []
  const attrs   = (sel.match(/\[\s*[a-zA-Z0-9\-\_]+\s*\=\s*(\"|\')?[a-zA-Z0-9\$\#\-\_\s]+(\"|\')?\s*\]/g) || []).reduce((acc, kvp) => {
    if (kvp == null) return acc
    let [key, val] = kvp.slice(1, kvp.length - 1).split(/\s*\=\s*/)
    acc[key]       = val.replace(/(\'|\")/g, "")
    return acc
  }, {})
  
    
  if (id) 
    props.id = id.slice(1)
  
  if (classes && classes.length) {
    props["class"] = props["class"] ? props["class"] + ` ${classes.join(' ')}` : classes.join(' ')
  }
  
  return picodomH(node, Object.assign({}, props, attrs), children)
}