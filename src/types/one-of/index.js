import
  { IShow
  } from "../../protocols/ishow"

import
  { ITypeCheck
  } from "../../protocols/itype-check"

import
  { is
  } from "../any"

import
  { typeToStr
  } from "../../utils/type-to-str"

// -- OneOf

export function OneOf (...Types) {
  if (!(this instanceof OneOf))
    return new OneOf(...Types)
  
  this.types = Types
  
  return this
}

ITypeCheck(OneOf,
  { typeCheck: (T, v) =>
      T.types.some(Type => is(v, Type))
  }
)

IShow(OneOf,
  { show: self => 
      `OneOf(${self.types.map(typeToStr).join(', ')})`
  }
)