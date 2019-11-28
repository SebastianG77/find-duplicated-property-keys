export const PropertyKey = (key, parent) => {
  const PropertyKey = {
    key: key,
    parent: parent,
    occurrence: 1,
    alternativeSpellings: [],
    parentPath: () => PropertyKey.parent == null ? [] : parent.parentPath().concat([PropertyKey.parent.key]),
    alternativeSpellingsPath: () => alternativeSpellings.map(alternativeSpelling => PropertyKey.parentPath(PropertyKey.parent).concat(alternativeSpelling)),
    propertyPath: () => PropertyKey.parentPath(PropertyKey.parent).concat([PropertyKey.key]),
    toString: () => PropertyKey.propertyPath().join('.')
  }
  return PropertyKey
}

export const addPropertyKeyToArray = (propertyKeyArray, propertyKey, options) => {
  const sensitivity = (options == null || options.sensitivity == null) ? 'variant' : options.sensitivity
  const propertyKeysInArray = findPropertyKeysInArray(propertyKeyArray, propertyKey, sensitivity)
  if (propertyKeysInArray.length === 0) {
    propertyKeyArray.push(propertyKey)
  } else if (propertyKeysInArray.length === 1) {
    propertyKeysInArray[0].occurrence++
    addAlternativeSpelling(propertyKeysInArray[0], propertyKey.key)
  } else {
    throw new Error(`Property ${propertyKey.toString()} occurs multiple times in propertyKeys.`)
  }
}

const findPropertyKeysInArray = (propertyKeysArray, propertyKey, selectedSensitivity) =>
  propertyKeysArray.filter(propertyInArray => propertyInArray.parent === propertyKey.parent &&
    (propertyInArray.key === propertyKey.key || (propertyInArray.key != null && propertyKey.key != null &&
      propertyInArray.key.localeCompare(propertyKey.key, undefined, { sensitivity: selectedSensitivity }) === 0)
    )
  )

const addAlternativeSpelling = (propertyKey, alternativeKey) => {
  if (propertyKey.key !== alternativeKey && !propertyKey.alternativeSpellings.includes(alternativeKey)) {
    propertyKey.alternativeSpellings.push(alternativeKey)
  }
}
