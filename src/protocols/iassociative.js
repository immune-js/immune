import 
  { Protocol
  } from "../utils/protocol"

import
  { Any
  } from "../types/any/any"

import
  { OneOf
  } from "../types/one-of"

export const IAssociative = Protocol("IAssociative",
  { get   : [ IAssociative, OneOf(String, Number)      ]
  , assoc : [ IAssociative, OneOf(String, Number), Any ]
  , keys  : [ IAssociative                             ]
  , vals  : [ IAssociative                             ]
  }
)

export const get   = IAssociative.get
export const assoc = IAssociative.assoc
export const keys  = IAssociative.keys
export const vals  = IAssociative.vals