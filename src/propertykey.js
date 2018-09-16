export const PropertyKey = (propertyPath) => {
  let PropertyKey = {
    propertyPath: propertyPath,
    occurrence: 1,
    toString: () => { return PropertyKey.propertyPath.join(`.`) }
  }
  return PropertyKey
}

export const findPropertyKeyInArray = (propertyKeyArray, propertyKey) => {
  for (let i = 0; i < propertyKeyArray.length; i++) {
    let propertyKeyItem = propertyKeyArray[i]
    if (propertyKey.length === propertyKeyItem.length) {
      let isEqual = true
      let propertyKeyPath = propertyKey.propertyPath
      let propertyKeyItemPath = propertyKeyItem.propertyPath
      for (let j = 0; j < propertyKeyPath.length; j++) {
        if (propertyKeyPath[j] !== propertyKeyItemPath[j]) {
          isEqual = false
          break
        }
      }
      if (isEqual) {
        return propertyKeyItem
      }
    }
  }
  return null
}
