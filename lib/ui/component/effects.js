import { Type, OneOf } from "../..";

export var MountEffect = Type("MountEffect", { comp: Object,
  path: OneOf(String, [OneOf(String, Number)]),
  props: Object
});

export var UnmountEffect = Type("UnmountEffect", { comp: Object,
  path: OneOf(String, [OneOf(String, Number)])
});