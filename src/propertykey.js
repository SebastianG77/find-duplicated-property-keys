export const PropertyKey = (key, parent) => {
  let PropertyKey = {
    propertyPath: parent == null ? [key] : parent.propertyPath.concat([key]),
    parent: parent,
    occurrence: 1,
    toString: () => { return PropertyKey.propertyPath.join(`.`) }
  }
  return PropertyKey
}

export const findPropertyKeysInArray = (propertyKeysArray, propertyKey) =>
  propertyKeysArray.filter(propertyInArray => propertyInArray.parent === propertyKey.parent && propertyPathsAreEqual(propertyInArray.propertyPath, propertyKey.propertyPath))

const propertyPathsAreEqual = (firstPropertyPath, secondPropertyPath) =>
  firstPropertyPath.length === secondPropertyPath.length && firstPropertyPath.every((propertyKey, index) => propertyKey === secondPropertyPath[index])
