import 
  { Protocol
  } from "../utils/protocol"

export const IFoldable = Protocol("IFoldable",
  { fold : [IFoldable, Function, Function]
  }
)

export const fold = IFoldable.fold