import 
  { Protocol
  } from "../utils/protocol"

export const IMonoid = Protocol("IMonoid",
  { empty  : [ IMonoid          ]
  , concat : [ IMonoid, IMonoid ]
  }
)

export const empty  = IMonoid.empty
export const concat = IMonoid.concat