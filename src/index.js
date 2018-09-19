import fs from 'fs'
import isJSON from 'is-json'
import { PropertyKey, findPropertyKeyInArray } from './propertykey'

export const findRedundantProperties = (jsonFile) => {
  if (fs.existsSync(jsonFile)) {
    let content = fs.readFileSync(jsonFile).toString()
    // let content = '{"aa,aa":"o,bja","b":["0","1","1,b","1c","1d", "2"],"b":1, "c":{"d":"some object"}}'
    if (isJSON(content)) {
      checkRedundancy(content)
    } else {
      console.log(`ERROR: File ${jsonFile} is no valid JSON file.`)
    }
  } else {
    console.log(`ERROR: File ${jsonFile} does not exist.`)
  }
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
  let parentStack = [PropertyKey([`<instance>`])]
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

      let currentPropertyKey = PropertyKey(parentStack[parentStack.length - 1].propertyPath.concat([formattedKey]))
      let propertyKeyInArray = findPropertyKeyInArray(propertyKeys, currentPropertyKey)
      let finalPropertyKey
      if (propertyKeyInArray === null) {
        finalPropertyKey = currentPropertyKey
        propertyKeys.push(finalPropertyKey)
      } else {
        propertyKeyInArray.occurrence++
        finalPropertyKey = propertyKeyInArray
      }

      if (splitByColon[1].trim() === (``)) {
        parentStack.push(finalPropertyKey)
      }

      if (splitByColon[1].trim().endsWith(`}`)) {
        parentStack.pop()
      }
    }
  })

  console.log('all ' + propertyKeys.toString())
  console.log(propertyKeys.filter(propertyKey => propertyKey.occurrence > 1).toString())
  return propertyKeys.filter(propertyKey => propertyKey.occurrence > 1)
}

const initContent = (content) => {
  let trimmedContent = content.trim()
  if (trimmedContent.startsWith(`{`) && trimmedContent.endsWith(`}`)) {
    return trimmedContent.substring(1, trimmedContent.length - 1).trim()
  } else {
    console.log(`Error: JSON Object is not wrapped by { }`)
  }
  return null
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
