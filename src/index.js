import fs from 'fs'
import { PropertyKey, findPropertyKeysInArray } from './propertykey'

export const findDuplicatedProperties = (jsonFile) => {
  if (fs.existsSync(jsonFile)) {
    let content = fs.readFileSync(jsonFile).toString()
    // let content = '{"aa,aa":"o,bja","b":["0","1","1,b","1c","1d", "2"],"b":1, "c":{"d":"some object"}}'
    if (isValidJSON(content)) {
      return checkRedundancy(content)
    } else {
      console.log(`ERROR: File ${jsonFile} is no valid JSON file.`)
    }
  } else {
    console.log(`ERROR: File ${jsonFile} does not exist.`)
  }
  return null
}

const checkRedundancy = (content) => {
  let formattedContent = initContent(content)
  if (formattedContent === null) {
    return null
  }

  /*
  * Regex for splitting by , or } characters which are not contained by quotes. Regex bases on the
  * answer to this question: https://stackoverflow.com/a/632552. The split function also returns
  * undefined values an and comma strings. So we just remove them as they are not needed.
  * Since also arrays may contain commas, this split will also return some invalid array entries
  * which are part of a subarray. However these invalid values will get filtered out later anyway, so
  * these values should not make any problems.
  *
  */
  let splittedContent = formattedContent.split(/\{(?=(?:[^"]|"[^"]*")*$)|,(?=(?:[^"]|"[^"]*")*$)/)
  let parentStack = []
  let propertyKeys = []
  splittedContent.forEach(keyValuePair => {
    /*
    * Regex for splitting by colons which are not contained by quotes. Regex has bases on this
    * answer https://stackoverflow.com/a/632552.
    *
    */
    let splitByColon = keyValuePair.split(/:(?=(?:[^"]|"[^"]*")*$)/)

    /*
    * If the length of the returned array is less than 2, we have an invalid split value, that is the result
    * of an arry. Since we are not intersted in the property values we simply ignore these entries.
    */
    if (splitByColon.length >= 2) {
      let formattedKey = formatKey(splitByColon[0])
      if (formattedKey === null) {
        return null
      }

      if (parentStack.length === 0) {
        /*
        * If the parents stack is empty we add a dummy parent '<instance>' to indicate the parent of the
        * property  is the root. Note: If the root is an array instead of an ordinary object, this if
        * statement may be passed multiple times.
        */
        parentStack.push(PropertyKey(`<instance>`, null))
      }

      let parent = parentStack[parentStack.length - 1]
      let currentPropertyKey = PropertyKey(formattedKey, parent)
      let propertyKeysInArray = findPropertyKeysInArray(propertyKeys, currentPropertyKey)
      if (propertyKeysInArray.length === 0) {
        propertyKeys.push(currentPropertyKey)
      } else if (propertyKeysInArray.length === 1) {
        propertyKeysInArray[0].occurrence++
      } else {
        console.log(`Error: Property ${currentPropertyKey.toString()} occurs multiple times in propertyKeys.`)
      }

      if (splitByColon[1].trim() === (``)) {
        parentStack.push(currentPropertyKey)
      }

      if (splitByColon[1].trim().endsWith(`}`)) {
        parentStack.pop()
      }
    }
  })
  return propertyKeys.filter(propertyKey => propertyKey.occurrence > 1)
}

const initContent = (content) => {
  return content.trim()
}

const formatKey = (unformattedKey) => {
  let formattedKey = unformattedKey.trim()
  if (formattedKey.startsWith(`"`) && formattedKey.endsWith(`"`)) {
    formattedKey = formattedKey.substring(1, formattedKey.length - 1)
    if (formattedKey.trim() === ``) {
      console.log(`Error: Key ${formattedKey} is empty`)
    } else {
      return formattedKey
    }
  } else {
    console.log(`Error: Key ${formattedKey} is not wrapped by ""`)
  }
  return null
}

const isValidJSON = (content) => {
  try {
    JSON.parse(content)
  } catch (err) {
    return false
  }
  return true
}
