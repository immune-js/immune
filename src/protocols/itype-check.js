import 
  { Protocol
  } from "../utils/protocol"

import
  { Any
  } from "../types/any/any"

export const ITypeCheck = Protocol("ITypeCheck",
  { typeCheck: [ITypeCheck, Any]
  }
)

export const typeCheck = ITypeCheck.typeCheck