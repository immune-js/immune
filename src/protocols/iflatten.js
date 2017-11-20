import 
  { Protocol
  } from "../utils/protocol"

export const IFlatten = Protocol("IFlatten",
  { flatten : [IFlatten, IFlatten]
  }
)

export const flatten = IFlatten.flatten