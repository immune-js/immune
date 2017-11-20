import 
  { Protocol
  } from "../utils/protocol"


export const IKeyed = Protocol("IKeyed",
  { dissoc : [IKeyed, String]
  }
)

export const dissoc = IKeyed.dissoc