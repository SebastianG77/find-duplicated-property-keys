export const PropertyKey = (key, parent, isArray) => {
  const PropertyKey = {
    key,
    parent,
    occurrence: 1,
    alternativeSpellings: [],
    isArray,
    propertyPath: () => PropertyKey.parent == null ? [PropertyKey.key] : parent.propertyPath().concat([PropertyKey.key]),
    toString: () => PropertyKey.parent == null ? [PropertyKey.key] : `${PropertyKey.parent.toString()}${PropertyKey.isArray ? PropertyKey.key : `.${PropertyKey.key}`}`,
    parentPath: () => PropertyKey.parent == null ? [] : PropertyKey.parent.parentPath().concat([PropertyKey.parent.key]),
    alternativeSpellingsPath: () => PropertyKey.alternativeSpellings.map(alternativeSpelling => PropertyKey.parentPath().concat(alternativeSpelling)),
    printAlternativeSpellings: () => {
      const parentString = PropertyKey.parent == null ? null : PropertyKey.parent.toString()
      return `[${PropertyKey.alternativeSpellings.map(alternativeSpelling => parentString == null ? [alternativeSpelling] : `${parentString}${PropertyKey.isArray ? alternativeSpelling : `.${alternativeSpelling}`}`).join(', ')}]`
    }
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
