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

describe(`String property <instance>.name is duplicated`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(path.join(appRootPath, `./assets/test_files/one_duplicated_string.json`))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `name`], 2)])
  })
})

describe(`String property <instance>.name occurs three times`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(path.join(appRootPath, `./assets/test_files/one_triplicated_string.json`))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `name`], 3)])
  })
})

describe(`Integer property <instance>.year is duplicated`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(path.join(appRootPath, `./assets/test_files/one_duplicated_integer.json`))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `year`], 2)])
  })
})

describe(`Number property <instance>.weight is duplicated`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(path.join(appRootPath, `./assets/test_files/one_duplicated_number.json`))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `weight`], 2)])
  })
})

describe(`Boolean property <instance>.isBoolean is duplicated`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(path.join(appRootPath, `./assets/test_files/one_duplicated_boolean.json`))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `isBoolean`], 2)])
  })
})

describe(`Array of string property <instance>.pets is duplicated`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(path.join(appRootPath, `./assets/test_files/one_duplicated_array.json`))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `pets`], 2)])
  })
})

describe(`Object property <instance>.myObject is duplicated`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(path.join(appRootPath, `./assets/test_files/one_duplicated_object.json`))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `myObject`], 2)])
  })
})

describe(`Property <instance>.year is duplicated and one property contains an integer whereas the other one contains a string value`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(path.join(appRootPath, `./assets/test_files/one_duplicated_property_with_different_value_types.json`))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `year`], 2)])
  })
})

describe(`Property <instance>.name is duplicated and contains the same values for each property`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(path.join(appRootPath, `./assets/test_files/one_duplicated_string_with_same_values.json`))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `name`], 2)])
  })
})

describe(`Object property <instance>.myObject is duplicated and both properties have the same content`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(path.join(appRootPath, `./assets/test_files/one_duplicated_object_with_same_content.json`))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `myObject`], 2)])
  })
})

const createPropertyKey = (propertyPath, occurrence) => {
  let propertyKey = PropertyKey()
  propertyKey.propertyPath = propertyPath
  propertyKey.occurrence = occurrence
  return propertyKey
}

const comparePropertyKeyArrays = (result, expected) => {
  expect(result).toHaveLength(expected.length)
  result.forEach(resultValue => {
    expect(expected.filter(expectedValue => (
      resultValue.occurrence === expectedValue.occurrence &&
      expectedValue.propertyPath.every((property, index) => (
        property === resultValue.propertyPath[index]
      )))).length).toBe(1)
  })
}
