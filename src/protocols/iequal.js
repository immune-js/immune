import
  { Any
  } from "../types/any/any"

import 
  { Protocol
  } from "../utils/protocol"

export const IEqual = Protocol("IEqual",
  { equals : [IEqual, Any]
  }
)

IEqual(Any,
  { equals : (self, other) => 
      self === other
  }
)

export const equals = IEqual.equals