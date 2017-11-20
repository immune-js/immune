import 
  { Protocol
  } from "../utils/protocol"

import
  { OneOf
  } from "../types/one-of"

export const IIndexed = Protocol("IIndexed",
  { nth   : [IIndexed, [OneOf(String, Number)]]
  }
)

export const nth = IIndexed.nth