import 
  { Protocol
  } from "../utils/protocol"

export const IBind = Protocol("IBind",
  { andThen : [IBind, Function]
  }
)

export const andThen = IBind.andThen