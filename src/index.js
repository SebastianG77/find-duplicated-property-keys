import { PropertyKey, addPropertyKeyToArray } from './propertykey'

export default (content) => {
  const contentType = typeof content
  if (contentType === 'string') {
    if (isValidJSON(content)) {
      return checkRedundancy(content)
    } else {
      throw new Error('Input is no valid JSON.')
    }
  } else {
    throwInvalidContentTypeError(content, contentType)
  }
}

const checkRedundancy = (content) => {
  const formattedContent = initContent(content)
  const allPropertyKeys = extractAllPropertyKeysOfContent(formattedContent)
  const aggregatedPropertyKeys = []

  allPropertyKeys.forEach(propertyKey => {
    addPropertyKeyToArray(aggregatedPropertyKeys, propertyKey)
  })

  return aggregatedPropertyKeys.filter(propertyKey => propertyKey.occurrence > 1)
}

const initContent = (content) => content.trim()

const extractAllPropertyKeysOfContent = (content) => {
  const parentStack = [PropertyKey('<instance>', null, false)]
  for (let i = 0; i < content.length; i++) {
    const currentChar = content.charAt(i)
    if (currentChar === '{') {
      return extractPropertyKeysOfObject(content, parentStack, i + 1).propertyKeys
    } else if (currentChar === '[') {
      return extractPropertyKeysOfArray(content, parentStack, i + 1).propertyKeys
    }
  }
  return []
}

const extractPropertyKeysOfObject = (content, parentStack, startIndex) => {
  let currentPropertyKey
  let allPropertyKeys = []
  for (let i = startIndex; i < content.length; i++) {
    const currentChar = content.charAt(i)
    if (!isWhitespace(currentChar)) {
      if (currentChar === '{' && currentPropertyKey !== undefined) {
        parentStack.push(currentPropertyKey.propertyKey)
        allPropertyKeys.push(currentPropertyKey.propertyKey)
        const extractedPropertyKeys = extractPropertyKeysOfObject(content, parentStack, i + 1)
        i = extractedPropertyKeys.newIndex
        allPropertyKeys = allPropertyKeys.concat(extractedPropertyKeys.propertyKeys)
        currentPropertyKey = undefined
        parentStack.pop()
      } else if (currentChar === '}') {
        return { propertyKeys: allPropertyKeys, newIndex: i }
      } else if (currentChar === '[') {
        parentStack.push(currentPropertyKey.propertyKey)
        allPropertyKeys.push(currentPropertyKey.propertyKey)
        const extractedPropertyKeys = extractPropertyKeysOfArray(content, parentStack, i + 1)
        i = extractedPropertyKeys.newIndex
        allPropertyKeys = allPropertyKeys.concat(extractedPropertyKeys.propertyKeys)
        currentPropertyKey = undefined
      } else if (currentChar === ']') {
        parentStack.pop()
      } else {
        if (currentPropertyKey === undefined) {
          currentPropertyKey = extractPropertyKey(content, parentStack, i)
          i = currentPropertyKey.newIndex
        } else {
          i = lastIndexOfPropertyValue(content, i)
          allPropertyKeys.push(currentPropertyKey.propertyKey)
          currentPropertyKey = undefined
        }
      }
    }
  }
}

const extractPropertyKeysOfArray = (content, parentStack, startIndex) => {
  let currentIndex = 0
  let currentKey = PropertyKey(`[${currentIndex}]`, parentStack[parentStack.length - 1], true)
  parentStack.push(currentKey)
  let allPropertyKeys = []
  for (let i = startIndex; i < content.length; i++) {
    const currentChar = content.charAt(i)
    if (!isWhitespace(currentChar)) {
      if (currentChar === ',') {
        parentStack.pop()
        currentIndex++
        currentKey = PropertyKey(`[${currentIndex}]`, parentStack[parentStack.length - 1], true)
        parentStack.push(currentKey)
      } else if (currentChar === '{') {
        const extractedPropertyKeys = extractPropertyKeysOfObject(content, parentStack, i + 1)
        i = extractedPropertyKeys.newIndex
        allPropertyKeys = allPropertyKeys.concat(extractedPropertyKeys.propertyKeys)
      } else if (currentChar === '[') {
        const extractedPropertyKeys = extractPropertyKeysOfArray(content, parentStack, i + 1)
        i = extractedPropertyKeys.newIndex
        allPropertyKeys = allPropertyKeys.concat(extractedPropertyKeys.propertyKeys)
      } else if (currentChar === ']') {
        parentStack.pop()
        return { propertyKeys: allPropertyKeys, newIndex: i - 1 }
      } else {
        i = lastIndexOfPropertyValue(content, i)
        allPropertyKeys.push(parentStack[parentStack.length - 1])
      }
    }
  }
}

const extractPropertyKey = (content, parentStack, startIndex) => {
  let quotationMarksFound = 0
  let isEscaped = false
  let startPropertyKeyIndex
  for (let i = startIndex; i < content.length; i++) {
    const currentChar = content.charAt(i)
    if (currentChar === '\\') {
      isEscaped = !isEscaped
    } else {
      if (isQuotationMark(currentChar, isEscaped)) {
        quotationMarksFound++
        if (startPropertyKeyIndex === undefined) {
          startPropertyKeyIndex = i
        }
      } else {
        if (quotationMarksFound === 2) {
          if (currentChar === ':') {
            const newSubStringEnding = i + 1
            return { propertyKey: PropertyKey(formatKey(content.substring(startPropertyKeyIndex, newSubStringEnding)), parentStack[parentStack.length - 1], false), newIndex: i }
          }
        }
      }
      isEscaped = false
    }
  }
}

const lastIndexOfPropertyValue = (content, startIndex) => {
  let evenAmountOfQuotationMarks = true
  let isEscaped = false
  for (let i = startIndex; i < content.length; i++) {
    const currentChar = content.charAt(i)
    if (currentChar === '\\') {
      isEscaped = !isEscaped
    } else {
      if (isQuotationMark(currentChar, isEscaped)) {
        evenAmountOfQuotationMarks = !evenAmountOfQuotationMarks
      } else {
        if ((currentChar === ',' || currentChar === '}' || currentChar === ']') && evenAmountOfQuotationMarks) {
          return i - 1
        }
        isEscaped = false
      }
    }
  }
}

const isWhitespace = (currentChar) => (currentChar.trim() === '')

const isQuotationMark = (currentChar, isEscaped) => (currentChar === '"' && !isEscaped)

const formatKey = (unformattedKey) => {
  const unformattedTrimmedKey = unformattedKey.trim()
  if (unformattedTrimmedKey.endsWith(':')) {
    const trimmedKeyOnly = unformattedKey.substring(0, unformattedKey.length - 1).trim()
    if (trimmedKeyOnly.length > 1 && trimmedKeyOnly.startsWith('"') && trimmedKeyOnly.endsWith('"')) {
      const formattedKey = trimmedKeyOnly.substring(1, trimmedKeyOnly.length - 1)
      return formattedKey
    } else {
      throw new Error(`Key ${unformattedKey} is not wrapped by "".`)
    }
  } else {
    throw new Error(`Key ${unformattedKey} does not end by :.`)
  }
}

const isValidJSON = (content) => {
  try {
    JSON.parse(content)
  } catch (err) {
    return false
  }
  return true
}

const throwInvalidContentTypeError = (content, contentType) => {
  if (content === null) {
    throw new Error('Input may not be null.')
  } else if (content === undefined) {
    throw new Error('Input may not be undefined.')
  } else {
    throw new Error(`Input is of type ${contentType}, but not of type string.`)
  }
}
