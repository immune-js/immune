import { IShow } from "../../protocols/ishow";

import { ITypeCheck } from "../../protocols/itype-check";

import { is } from "../any";

import { typeToStr } from "../../utils/type-to-str";

// -- OneOf

export function OneOf() {
  for (var _len = arguments.length, Types = Array(_len), _key = 0; _key < _len; _key++) {
    Types[_key] = arguments[_key];
  }

  if (!(this instanceof OneOf)) return new (Function.prototype.bind.apply(OneOf, [null].concat(Types)))();

  this.types = Types;

  return this;
}

ITypeCheck(OneOf, { typeCheck: function typeCheck(T, v) {
    return T.types.some(function (Type) {
      return is(v, Type);
    });
  }
});

IShow(OneOf, { show: function show(self) {
    return "OneOf(" + self.types.map(typeToStr).join(', ') + ")";
  }
});