import { VECTOR_DIRECTION_ENUM } from './types/vector/vector-utils'

export function isSequence(arr: number[]) {
  if (arr.length <= 1) {
    return false
  }

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] - arr[i - 1] != 1) return false
  }
  return true
}

//LOOKUP: https://stackoverflow.com/questions/62303746/define-a-type-for-an-object-where-all-values-have-the-same-type
//Define an object where all keys are of the same type
export function random<T>(src: Object, previousValue: T | undefined): T {
  let nValue: T
  do {
    nValue =
      Object.values(src)[
        Math.floor(Math.random() * (Object.keys(src).length - 1))
      ]
  } while (nValue === previousValue)

  return nValue
}
