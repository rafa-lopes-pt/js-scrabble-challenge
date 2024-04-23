/**
 * Checks if elements inside a given array appear in a numerical sequence with no gaps
 */
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

/**
 *
 * @param src Object to randomize from
 * @param callback (optional) - callback that conditions output random element. i.e don't return a repeated, either the previous, or from a given list
 * @returns The value of one of src properties
 */
export function random<O extends Object, K extends keyof O, V extends O[K]>(
  src: O,
  callback: (randomValue: V, ...args: any) => boolean = () => false
): V {
  let nValue: V
  do {
    nValue =
      Object.values(src)[
        Math.floor(Math.random() * (Object.keys(src).length - 1))
      ]
  } while (callback(nValue))

  return nValue
}

export function isEqual<T extends any>(a: T, b: T): boolean {
  if (typeof a !== typeof b) return false // failsafe
  //Undefined && Nullish Values
  if (!a || !b) {
    return a === b
  }
  //Native Type Equality
  if (typeof a !== 'object') {
    return a === b
  }
  //Object Equality
  const keys = Object.keys(a),
    testKeys = Object.keys(b)

  if (keys.length !== testKeys.length) return false

  for (let key of keys) {
    // Native Type Equality
    if (typeof a[key] !== 'object') {
      if (!testKeys.includes(key) || a[key] !== b[key]) return false
    }
    //Object Equality
    else return isEqual(a[key], b[key])
  }

  return true
}
