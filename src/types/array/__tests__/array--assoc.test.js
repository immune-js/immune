import
  { assoc
  } from '../../../index'

test("it should update an exisiting value", () => {
  expect(assoc([1,2,3], 0, 4)).toEqual([4,2,3])
})

test("it should be non-destructive", () => {
  const arr = [1,2,3]
  assoc(arr, 0, 4)
  expect(arr).toEqual([1,2,3])
})

test("it should only update paths already in the array", () => {
  expect(assoc([1,2,3], 3, 4)).toEqual([1,2,3])
})