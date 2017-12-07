import nanoid from "nanoid"

import 
  { patch
  } from "picodom"

import 
  { Component
  , MountComponent
  , UnmountComponent
  , AsyncComponent
  } from "./component"

import
  { IMMUNE_KEYES_SYM
  } from "../.."

import
  { Task
  , Union
  , None
  , fold
  , foldl
  , conj
  , getIn
  , getIn_
  , assocIn
  , constant
  } from "../"

import h        from "./h"
import hydrate  from "./hydrate"
import AppState from "./app-state"

const viewActions = (component, path, state) => {
  if (!component.Msg) return {}
  if (process.env.NODE_ENV !== "production") {
    const proxy = {
      get: (target, name) => {
        if (target && typeof(target[name]) === "function") {
          return (...args) => {
            const update = component.update(state, target[name](...args), None())
            AppState.assocIn(path, update.state)
            executeEffects(component, update.effects, path, update.state)
          }
        } else {
          if (target == null)
            throw InvalidDispatch("The component does not export a Msg type")
          if (typeof(target[name]) !== "function") 
            throw InvalidDispatch(`The Msg type does not define an message called ${name}`)
        }
      }
    }
    
    return new Proxy(Object.assign({}, component.Msg), proxy)
  } else {
    const actions = foldl(component.Msg[IMMUNE_KEYES_SYM], {}, (acc, msgName) => 
      conj(acc, [msgName, (...args) => {
        const update = component.update(getIn_(AppState.state, path), component.Msg[msgName](...args), None())
        AppState.assocIn(path, update.state)
        executeEffects(component, update.effects, path, update.state)
      }])
    )
    
    return actions
  }

}

const executeEffects = (component, effects, path, state) => {
  effects.forEach(eff => {
    const task = eff instanceof Union ? Task.of(eff) : eff
    
    if (task === Task.none)
      return
    
    task.fork(err => console.error(err), msg => {
      if (msg == null)
        return
      
      if (msg instanceof MountComponent)
        return AppState.assocIn(path, assocIn(state, msg.path, undefined))
      
      if (msg instanceof UnmountComponent)
        return unmountComponent(path.concat(msg.path))
      
      const { state: updateState, effects: updateEffects } = component.update(state, msg, None())
      
      AppState.assocIn(path, updateState)
      
      if (updateEffects.length)
        executeEffects(component, updateEffects, path, updateState)
    })
  })
}

const mountedComponents = {}

const mountComponent = (component, path) => {
  let subscriptions = []
  
  if (typeof(component.subscriptions) === "function") {
    subscriptions = component.subscriptions().map(subscription => {
      const listener =
        { next  : msg => executeEffects(component, [Task.of(msg)], path, getIn_(AppState.state, path))
        , error : err => console.error(err)
        }
        
      subscription.addListener(listener)
      return () => subscription.removeListener(listener)
    })
  }
  
  const componentData = { component, subscriptions, key: nanoid() }
  
  mountedComponents[path.join("-")] = componentData
  
  return componentData
}

const unmountComponent = path => {
  const pathKey = path.join("-")
  const { component, subscriptions } = mountedComponents[pathKey] 
  
  subscriptions.forEach(removeListener => removeListener())
  
  delete mountedComponents[pathKey]
  
  AppState.dissocIn(path)
}

const isMounted = path => {
  return !!mountedComponents[path.join("-")]
}

const resolvedPaths = {}

export const renderView = (component, state, path, props) => {
  const { key } = mountedComponents[path.join("-")]
  
  const view = component.view(
    { state   : state
    , actions : viewActions(component, path, state)
    , props
    }
  )
  
  view.data.key = view.data.key || key
  
  const oldOnCreate = view.data.oncreate
  
  view.data.oncreate = (...args) => {
    if (typeof(component.mount) === "function") {
      const { state: mountState, effects: mountEffects } = component.mount(state, None())
      AppState.assocIn(path, mountState)
      executeEffects(component, mountEffects, path, mountState)
    }
    
    if (typeof (oldOnCreate) === "function")
      return oldOnCreate(...args)
  }
  
  return view
}

const traverse = (comp, path, state) => {
  if (comp instanceof AsyncComponent) {
    const resolvedComp = resolvedPaths[path.concat(comp.path).join("-")]
    
    if (!resolvedComp) {
      const res = comp.component.fork(() => {}, asyncComp => {
        resolvedPaths[path.concat(comp.path).join("-")] = { comp: asyncComp["default"], props: comp.props.props }
        AppState.update(state => state)
      })
      
      return typeof(comp.props.loader) == "function" ? comp.props.loader() : comp.props.loader == null ? { tag: null, data: {}, children: [] } : comp.props.loader
    }
    
    comp = resolvedComp.comp((path[0] === "application" ? path.slice(1, path.length) : path).concat(comp.path), resolvedComp.props)
  }
  
  if (comp instanceof Component) {
    const componentPath  = path.concat(comp.path)
    const componentState = getIn(state, componentPath)
    const props          = { context: None(), ...comp.props }
    
    const view = fold(componentState,
      state => {
        if (!isMounted(componentPath)) 
          mountComponent(comp.component, componentPath)
        
        return renderView(comp.component, state, componentPath, props)
      },
      () => {
        const { state: initState, effects: initEffects } = comp.component.init(props)
        
        AppState.assocIn(componentPath, initState)
        
        mountComponent(comp.component, componentPath)
        
        initEffects.length && executeEffects(comp.component, initEffects, componentPath, initState)
        
        return renderView(comp.component, initState, componentPath, props)
      }
    )
    
    return traverse(
      view,
      path.concat(comp.path || []), 
      state
    )
  }
  
  if (typeof(comp) === "string" || typeof(comp) === "number")
    return comp.toString()
    
  return (
    { tag      : comp.tag
    , data     : comp.data
    , children : comp.children.map(child => traverse(child, path.concat(comp.path || []), state))
    }
  )
}

let isRendering     = false

export default target => {
  let { element, oldNode } = hydrate(target)
  
  const render = (state, comp) => {
    const domTree = traverse(comp, [], state)
    
    if (!isRendering) {
      isRendering = true
      requestAnimationFrame(() => {
        console.log("rendering...")
        element = patch
          ( oldNode
          , (oldNode = domTree)
          , element
          , target
          )
          isRendering = false
      })
    }
  }
  
  return render
}
