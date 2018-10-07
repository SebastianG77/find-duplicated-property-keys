import { PropertyKey, addPropertyKeyToArray } from './propertykey'

export default (content) => {
  if (isValidJSON(content)) {
    return checkRedundancy(content)
  } else {
    throw new Error(`Input is no valid JSON.`)
  }
}

const checkRedundancy = (content) => {
  let formattedContent = initContent(content)
  let allPropertyKeys = extractAllPropertyKeysOfContent(formattedContent)
  let aggregatedPropertyKeys = []

  allPropertyKeys.forEach(propertyKey => {
    addPropertyKeyToArray(aggregatedPropertyKeys, propertyKey)
  })

  return aggregatedPropertyKeys.filter(propertyKey => propertyKey.occurrence > 1)
}

const initContent = (content) => content.trim()

const extractAllPropertyKeysOfContent = (content) => {
  let parentStack = [PropertyKey(`<instance>`, null)]
  for (let i = 0; i < content.length; i++) {
    let currentChar = content.charAt(i)
    if (currentChar === '{') {
      return extractPropertyKeysOfObject(content, parentStack, i + 1).propertyKeys
    } else if (currentChar === '[') {
      return extractPropertyKeysOfArray(content, parentStack, i + 1).propertyKeys
    }
  }
}

const extractPropertyKeysOfObject = (content, parentStack, startIndex) => {
  let currentPropertyKey
  let allPropertyKeys = []
  for (let i = startIndex; i < content.length; i++) {
    let currentChar = content.charAt(i)
    if (!isWhitespace(currentChar)) {
      if (currentChar === '{' && currentPropertyKey !== undefined) {
        parentStack.push(currentPropertyKey.propertyKey)
        allPropertyKeys.push(currentPropertyKey.propertyKey)
        let extractedPropertyKeys = extractPropertyKeysOfObject(content, parentStack, i + 1)
        i = extractedPropertyKeys.newIndex
        allPropertyKeys = allPropertyKeys.concat(extractedPropertyKeys.propertyKeys)
        currentPropertyKey = undefined
        parentStack.pop()
      } else if (currentChar === '}') {
        return { propertyKeys: allPropertyKeys, newIndex: i }
      } else if (currentChar === '[') {
        parentStack.push(currentPropertyKey.propertyKey)
        allPropertyKeys.push(currentPropertyKey.propertyKey)
        let extractedPropertyKeys = extractPropertyKeysOfArray(content, parentStack, i + 1)
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
  let currentKey = PropertyKey(`[${currentIndex}]`, parentStack[parentStack.length - 1])
  parentStack.push(currentKey)
  let allPropertyKeys = []
  for (let i = startIndex; i < content.length; i++) {
    let currentChar = content.charAt(i)
    if (!isWhitespace(currentChar)) {
      if (currentChar === `,`) {
        parentStack.pop()
        currentIndex++
        currentKey = PropertyKey(`[${currentIndex}]`, parentStack[parentStack.length - 1])
        parentStack.push(currentKey)
      } else if (currentChar === `{`) {
        let extractedPropertyKeys = extractPropertyKeysOfObject(content, parentStack, i + 1)
        i = extractedPropertyKeys.newIndex
        allPropertyKeys = allPropertyKeys.concat(extractedPropertyKeys.propertyKeys)
      } else if (currentChar === `[`) {
        let extractedPropertyKeys = extractPropertyKeysOfArray(content, parentStack, i + 1)
        i = extractedPropertyKeys.newIndex
        allPropertyKeys = allPropertyKeys.concat(extractedPropertyKeys.propertyKeys)
      } else if (currentChar === `]`) {
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
    let currentChar = content.charAt(i)
    if (currentChar === `\\`) {
      isEscaped = !isEscaped
    } else {
      if (isQuotationMark(currentChar, isEscaped)) {
        quotationMarksFound++
        if (startPropertyKeyIndex === undefined) {
          startPropertyKeyIndex = i
        }
      } else {
        if (quotationMarksFound === 2) {
          if (currentChar === `:`) {
            let newSubStringEnding = i + 1
            return { propertyKey: PropertyKey(formatKey(content.substring(startPropertyKeyIndex, newSubStringEnding)), parentStack[parentStack.length - 1]), newIndex: i }
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
    let currentChar = content.charAt(i)
    if (currentChar === `\\`) {
      isEscaped = !isEscaped
    } else {
      if (isQuotationMark(currentChar, isEscaped)) {
        evenAmountOfQuotationMarks = !evenAmountOfQuotationMarks
      } else {
        if ((currentChar === `,` || currentChar === `}` || currentChar === `]`) && evenAmountOfQuotationMarks) {
          return i - 1
        }
        isEscaped = false
      }
    }
  }
}

const isWhitespace = (currentChar) => (currentChar.trim() === ``)

const isQuotationMark = (currentChar, isEscaped) => (currentChar === `"` && !isEscaped)

const formatKey = (unformattedKey) => {
  let trimmedKey = unformattedKey.trim()
  if (trimmedKey.startsWith(`"`) && trimmedKey.endsWith(`":`)) {
    let formattedKey = trimmedKey.substring(1, trimmedKey.length - 2)
    return formattedKey
  } else {
    throw new Error(`Key ${unformattedKey} is not wrapped by ""`)
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
