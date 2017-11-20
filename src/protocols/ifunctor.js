import 
  { Protocol
  } from "../utils/protocol"

export const IFunctor = Protocol("IFunctor",
  { map: [IFunctor, Function]
  }
)

export const map = IFunctor.map