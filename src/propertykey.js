export const PropertyKey = (key, parent) => {
  let PropertyKey = {
    propertyPath: parent == null ? [key] : parent.propertyPath.concat([key]),
    parent: parent,
    occurrence: 1,
    toString: () => { return PropertyKey.propertyPath.join(`.`) }
  }
  return PropertyKey
}

export const addPropertyKeyToArray = (propertyKeyArray, propertyKey) => {
  let propertyKeysInArray = findPropertyKeysInArray(propertyKeyArray, propertyKey)
  if (propertyKeysInArray.length === 0) {
    propertyKeyArray.push(propertyKey)
  } else if (propertyKeysInArray.length === 1) {
    propertyKeysInArray[0].occurrence++
  } else {
    throw new Error(`Property ${propertyKey.toString()} occurs multiple times in propertyKeys.`)
  }
}

const findPropertyKeysInArray = (propertyKeysArray, propertyKey) =>
  propertyKeysArray.filter(propertyInArray => propertyInArray.parent === propertyKey.parent && propertyPathsAreEqual(propertyInArray.propertyPath, propertyKey.propertyPath))

const propertyPathsAreEqual = (firstPropertyPath, secondPropertyPath) =>
  firstPropertyPath.length === secondPropertyPath.length && firstPropertyPath.every((propertyKey, index) => propertyKey === secondPropertyPath[index])
