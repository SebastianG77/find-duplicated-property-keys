import path from 'path'
import appRoot from 'app-root-path'

import { PropertyKey } from '../propertykey'
import { findDuplicatedProperties } from '../index'

const { describe, expect, it } = global

let appRootPath = appRoot.toString()

describe(`Validate a JSON file that does not contain any duplicates`, () => {
  it(`returns an empty list`, () => {
    let duplicatedProperties = findDuplicatedProperties(path.join(appRootPath, `./assets/test_files/valid_JSON_file.json`))
    expect(duplicatedProperties).toHaveLength(0)
  })
})

describe(`Property <instance>.name is duplicated`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(path.join(appRootPath, `./assets/test_files/one_duplicated_string.json`))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `name`], 2)])
  })
})

const createPropertyKey = (propertyPath, occurrence) => {
  let propertyKey = PropertyKey(propertyPath)
  propertyKey.occurrence = occurrence
  return propertyKey
}

const comparePropertyKeyArrays = (result, expected) => {
  expect(result).toHaveLength(expected.length)
  result.forEach(resultValue => {
    expect(expected.filter(expectedValue =>
      resultValue.occurrence === expectedValue.occurrence &&
      expectedValue.propertyPath.every(property =>
        expectedValue.propertyPath[expectedValue.propertyPath.indexOf(property)]
        === resultValue.propertyPath[expectedValue.propertyPath.indexOf(property)]))).toHaveLength(1)
  })
}