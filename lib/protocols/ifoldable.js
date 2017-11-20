import { Protocol } from "../utils/protocol";

export var IFoldable = Protocol("IFoldable", { fold: [IFoldable, Function, Function]
});

export var fold = IFoldable.fold;