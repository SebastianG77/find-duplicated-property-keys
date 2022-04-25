export const PropertyKey = (key, parent, isArray) => {
  const PropertyKey = {
    key,
    parent,
    occurrence: 1,
    isArray,
    propertyPath: () => PropertyKey.parent == null ? [PropertyKey.key] : parent.propertyPath().concat([PropertyKey.key]),
    toString: () => PropertyKey.parent == null ? [PropertyKey.key] : `${PropertyKey.parent.toString()}${PropertyKey.isArray ? PropertyKey.key : `.${PropertyKey.key}`}`
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
