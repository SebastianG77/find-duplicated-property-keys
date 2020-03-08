export class PropertyKey {
  constructor (key, parent, isArray) {
    this.key = key
    this.parent = parent
    this.occurrence = 1
    this.alternativeSpellings = []
    this.isArray = isArray
  }

  parentPath () {
    return this.parent == null ? [] : this.parent.parentPath().concat([this.parent.key])
  }

  alternativeSpellingsPath () {
    return this.alternativeSpellings.map(alternativeSpelling => this.parentPath().concat(alternativeSpelling))
  }

  propertyPath () {
    return this.parentPath().concat([this.key])
  }

  /*
  * TODO: partly copied from toString() - try using a more generic approach
  */
  printAlternativeSpellings () {
    const parentString = this.parent == null ? null : this.parent.toString()
    return `[${this.alternativeSpellings.map(alternativeSpelling => parentString == null ? [alternativeSpelling] : `${parentString}${this.isArray ? alternativeSpelling : `.${alternativeSpelling}`}`).join(', ')}]`
  }

  toString () {
    return this.parent == null ? [this.key] : `${this.parent.toString()}${this.isArray ? this.key : `.${this.key}`}`
  }
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
