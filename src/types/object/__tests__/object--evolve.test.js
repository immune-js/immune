import
  { evolve
  , getOrElse
  , concat
  } from "../../.."

test("given a receipt of changes it should return a copy of the original object with the changes applied", () => {
  expect(evolve({ a: 1, b: { c: 4, d: [3, 4] }, h: 2 },
    { a: 3
    , b: { c: 8
         , d: coll => concat(getOrElse(coll, []), [5, 6])
         , e: coll => concat(getOrElse(coll, []), [1, 2])
         , f: coll => [1, 2, 3]
         , g: { x: 3 }
         }
    , 
    }
  )).toEqual({ a: 3, b: { c: 8, d: [3, 4, 5, 6], e: [1, 2], f: [1, 2, 3], g: { x: 3 } }, h: 2 })
})

test("it should create new top-level paths", () => {
  expect(evolve({ foo: "foo" }, { foo: { bar: { baz: "quux" } }}))
    .toEqual({ foo: { bar: { baz: "quux" } } })
})