export const PropertyKey = (key, parent) => {
  const PropertyKey = {
    key: key,
    parent: parent,
    occurrence: 1,
    propertyPath: () => PropertyKey.parent == null ? [PropertyKey.key] : parent.propertyPath().concat([PropertyKey.key]),
    toString: () => PropertyKey.propertyPath().join(`.`)
  }
  return PropertyKey
}

export const addPropertyKeyToArray = (propertyKeyArray, propertyKey) => {
  const propertyKeysInArray = findPropertyKeysInArray(propertyKeyArray, propertyKey)
  if (propertyKeysInArray.length === 0) {
    propertyKeyArray.push(propertyKey)
  } else if (propertyKeysInArray.length === 1) {
    propertyKeysInArray[0].occurrence++
  } else {
    throw new Error(`Property ${propertyKey.toString()} occurs multiple times in propertyKeys.`)
  }
}

const findPropertyKeysInArray = (propertyKeysArray, propertyKey) =>
  propertyKeysArray.filter(propertyInArray => propertyInArray.parent === propertyKey.parent && propertyInArray.key === propertyKey.key)
