import 
  { Protocol
  } from "../utils/protocol"

import
  { Any
  } from "../types/any/any"

export const IShow = Protocol("IShow",
  { show: [IShow]
  }
)

IShow(Any,
  { show: self => self.toString()
  }
)

export const show = IShow.show