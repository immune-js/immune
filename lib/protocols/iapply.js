import { Protocol } from "../utils/protocol";

export var IApply = Protocol("IApply", { ap: [IApply, IApply]
});

export var ap = IApply.ap;