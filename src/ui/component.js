import
  { Type
  , Task
  , getIn
  , map
  } from "../"

import nanoid from "nanoid"
import format from "nanoid/format"
import url    from "nanoid/url"

export const Component = Type("Component",
  { component : { init: Function, view: Function }
  , path      : Array
  , props     : Object
  }
)

export const MountComponent   = Type("MountComponent"   , { path: Array })
export const UnmountComponent = Type("UnmountComponent" , { path: Array })

export const step = (state, effects = []) => ({ state, effects })

export default comp => {
  const instance = (path, props = {}) =>
    Component(comp, Array.isArray(path) ? path : [path], props)
  
  instance.dynamic = ([state, ...path], f) =>
    map(getIn(state, path, []), ([key, _]) => {
      const el = f(key, (props = {}) => instance(path.concat(key), props))
      
      if (!el.data.key)
        el.data.key = key
      
      return el
    })
  
  instance.mount = (path, id) =>
    Task((fail, succeed) =>
      succeed(MountComponent((Array.isArray(path) ? path : [path]).concat(id == null ? format(nanoid, "abcdefghijklmnopqrstuvwxyz", 10) : id.toString())))
    )
  
  instance.unmount = path =>
    Task((fail, succeed) =>
      succeed(UnmountComponent(Array.isArray(path) ? path : [path]))
    )
  
  return instance
}