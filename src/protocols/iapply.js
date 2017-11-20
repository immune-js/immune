import 
  { Protocol
  } from "../utils/protocol"

export const IApply = Protocol("IApply",
  { ap : [IApply, IApply]
  }
)

export const ap = IApply.ap