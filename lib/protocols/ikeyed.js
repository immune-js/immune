import { Protocol } from "../utils/protocol";

export var IKeyed = Protocol("IKeyed", { dissoc: [IKeyed, String]
});

export var dissoc = IKeyed.dissoc;