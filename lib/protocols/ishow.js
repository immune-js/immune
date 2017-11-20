import { Protocol } from "../utils/protocol";

import { Any } from "../types/any/any";

export var IShow = Protocol("IShow", { show: [IShow]
});

IShow(Any, { show: function show(self) {
    return self.toString();
  }
});

export var show = IShow.show;