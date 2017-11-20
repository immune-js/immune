import
  { Task
  , maybe
  , andThen
  , map
  , foldl
  , getIn_
  , assocIn
  , dissocIn
  } from "../"

import
  { Component
  , MountComponent
  , UnmountComponent
  , step
  } from "../ui/component"

const executeEffects = (component, appState, path, effects, context) => 
  andThen(Task.parallel(effects), msgs => {
    const next = msgs.reduce((current, msg) => {
      if (!msg) return current
      
      if (msg instanceof MountComponent) 
        return step(assocIn(current.state, path.concat(msg.path), undefined))
      
      if (msg instanceof UnmountComponent)
        return step(dissocIn(current.state, path.concat(msg.path).map(x => x.toString())))
      
      return transition(current, component.update(getIn_(current.state, path), msg, context), path)
    }, step(appState))
    
    return next.effects.length
      ? executeEffects(component, next.state, path, next.effects, context)
      : Task.of(next.state)
  })

const mountComponent = (Component, appState, path, context) => {
  const { state, effects } = Component.component.init({ context: maybe(context), ...Component.props })
  
  return executeEffects(Component.component, assocIn(appState, path, state), path, effects, context)
}

const traverseVdomTree = (vnode, state, path, context, html = "") => {
  if (vnode instanceof Component)
    return andThen(mountComponent(vnode, state, path.concat(vnode.path), context), nextState => {
      const nextVdom = vnode.component.view(
        { state   : getIn_(nextState, path.concat(vnode.path))
        , actions : {}
        , props   : { context: maybe(context), ...vnode.props } 
        }
      )
      return traverseVdomTree(nextVdom, nextState, path.concat(vnode.path), context, html)
    })
  
  const tag      = vnode.tag
  const attrs    = Object.keys(vnode.data || {})
  const children = vnode.children || []
  
  return map(
    foldl(children, Task.of([state, ""]), (acc, child) => andThen(acc, ([nextState, html]) =>
      typeof(child) === "string" ? Task.of([state, html + child]) : traverseVdomTree(child, nextState, path, context, html)
    )),
    ([state, childHTML]) =>
      [state, html + `<${tag} ${attrs.map(attr => `${attr}="${stringifyAttribute(attr, vnode.data[attr])}"`).join(" ")}>${childHTML}</${tag}>`]
  )
}

export default (Component, context) =>
  andThen(traverseVdomTree(Component, {}, [], context), ([state, html]) => 
    Task.of((console.log("appState:", JSON.stringify(state)), [state, html]))
  )

// -- Utils

const stringifyAttribute = (attr, val) =>
  attr === "style"
    ? Object.keys(val).reduce((acc, key) => acc + key.replace(/[A-Z]/g, "-$&").toLowerCase() + ":" + val[key] + ";", "")
    : val

const transition = (current, next, path) =>
  step(assocIn(current.state, path, next.state), current.effects.concat(next.effects))