import 
  { Protocol
  } from "../utils/protocol"

export const ICollection = Protocol("ICollection",
  { first   : [ICollection]
  , rest    : [ICollection]
  , conj    : [ICollection]
  }
)

export const first = ICollection.first
export const rest  = ICollection.rest
export const conj  = ICollection.conj