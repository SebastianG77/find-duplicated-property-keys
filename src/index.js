import { PropertyKey, findPropertyKeysInArray } from './propertykey'

export const findDuplicatedProperties = (content) => {
  if (isValidJSON(content)) {
    return checkRedundancy(content)
  } else {
    throw new Error(`Input is no valid JSON file.`)
  }
}

const checkRedundancy = (content) => {
  let formattedContent = initContent(content)

  let splittedContent = manualSplit(formattedContent)
  let parentStack = []
  let propertyKeys = []
  splittedContent.forEach(keyValuePair => {
    console.log('keyValuePair ' + keyValuePair.key + ' ' + keyValuePair.key.endsWith(':') + ' myvalue ' + keyValuePair.value + ' parentstacksize ' + parentStack.map(parent => parent.propertyKey).toString())

    let unformattedKey = keyValuePair.key
    let value = keyValuePair.value

    /*
     * If the key does not have a : it must be an array key.
    */
    if (unformattedKey.endsWith(':')) {
      addInstanceParentToStackIfNecessary(parentStack)

      let formattedKey = formatKey(unformattedKey)

      let parent = parentStack[parentStack.length - 1]
      let currentPropertyKey = PropertyKey(formattedKey, parent)
      let propertyKeysInArray = findPropertyKeysInArray(propertyKeys, currentPropertyKey)
      if (propertyKeysInArray.length === 0) {
        propertyKeys.push(currentPropertyKey)
      } else if (propertyKeysInArray.length === 1) {
        propertyKeysInArray[0].occurrence++
      } else {
        throw new Error(`Property ${currentPropertyKey.toString()} occurs multiple times in propertyKeys.`)
      }

      if (value === `{` || value === `[`) {
        parentStack.push(currentPropertyKey)
      }

      /*
       * Value is of any type but followed by a } instead of a ,
       */
      if ((value.endsWith(`}`)) || value.endsWith(`]`)) {
        parentStack.pop()
      }
    } else {
      if (value === `[` || (value.endsWith(`,`) && value !== (`,`)) || value === `{`) {
        /*
        * Array values may contain duplicates. However, if an array value contains an object, the object
        * itself has to be checked for duplicates. Hence we add the array index to the parent stack but do not
        * add the key to propertyKeys.
        */
        if (value.endsWith(`,`) || value === '{') {
          parentStack.pop()
        }

        addInstanceParentToStackIfNecessary(parentStack)
        let currentPropertyKey = PropertyKey(unformattedKey, parentStack[parentStack.length - 1])
        parentStack.push(currentPropertyKey)
      } else if (value.endsWith(']')) {
        parentStack.pop()
      }
    }
  })
  return propertyKeys.filter(propertyKey => propertyKey.occurrence > 1)
}

const initContent = (content) => {
  return content.trim()
}

const addInstanceParentToStackIfNecessary = (parentStack) => {
  if (parentStack.length === 0) {
    /*
    * If the parents stack is empty we add a dummy parent '<instance>' to indicate the parent of the
    * property  is the root. Note: If the root is an array instead of an ordinary object, this if
    * statement may be passed multiple times.
    */
    parentStack.push(PropertyKey(`<instance>`, null))
  }
}

const manualSplit = (content) => {
  let equalAmountOfQuotes = true
  let isEscaped = false
  let lastSubStringEnding = 0
  let currentKey
  let arrayStack = []
  let keyValuePairs = []
  for (let i = 0; i < content.length; i++) {
    let currentChar = content.charAt(i)
    if (currentChar === `\\`) {
      isEscaped = !isEscaped
    } else {
      if (currentChar === `"` && !isEscaped) {
        equalAmountOfQuotes = !equalAmountOfQuotes
      } else {
        let newSubStringEnding = i + 1
        if (equalAmountOfQuotes) {
          if (currentChar === `:`) {
            currentKey = content.substring(lastSubStringEnding, newSubStringEnding).trim()
            lastSubStringEnding = newSubStringEnding
          } else if (currentChar === `,` || currentChar === `{` || currentChar === `}` || currentChar === `[` || currentChar === `]`) {
            let rawCurrentKey
            let currentValue = content.substring(lastSubStringEnding, newSubStringEnding).trim()
            if (currentChar === `[`) {
              arrayStack.push(0)
            }
            if (currentKey === undefined) {
              if (currentChar === `,`) {
                arrayStack[arrayStack.length - 1]++
              }
              rawCurrentKey = arrayStack[arrayStack.length - 1]
              currentKey = `[${rawCurrentKey}]`
            } else {
              rawCurrentKey = currentKey
            }
            if (rawCurrentKey !== undefined) {
              keyValuePairs.push({ key: currentKey, value: currentValue })
            }

            currentKey = undefined
            if (currentChar === ']') {
              arrayStack.pop()
            }
            lastSubStringEnding = newSubStringEnding
          }
        }
      }
      isEscaped = false
    }
  }
  return keyValuePairs
}

const formatKey = (unformattedKey) => {
  let formattedKey = unformattedKey.trim()
  if (formattedKey.startsWith(`{`)) {
    formattedKey = formattedKey.substring(1, formattedKey.length)
    formattedKey = formattedKey.trim()
  }
  if (formattedKey.startsWith(`"`) && formattedKey.endsWith(`":`)) {
    formattedKey = formattedKey.substring(1, formattedKey.length - 2)
    if (formattedKey.trim() === ``) {
      throw new Error(`Key ${formattedKey} is empty`)
    } else {
      return formattedKey
    }
  } else {
    throw new Error(`Key ${formattedKey} is not wrapped by ""`)
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
