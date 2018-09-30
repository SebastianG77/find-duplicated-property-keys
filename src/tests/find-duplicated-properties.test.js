import path from 'path'
import appRoot from 'app-root-path'
import fs from 'fs'

import { PropertyKey } from '../propertykey'
import { findDuplicatedProperties } from '../index'

const { describe, expect, it } = global

let appRootPath = appRoot.toString()

describe(`Validate a JSON file that does not contain any duplicates`, () => {
  it(`returns an empty list`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/valid_JSON_file.json`)))
    expect(duplicatedProperties).toHaveLength(0)
  })
})

describe(`String property <instance>.name is duplicated`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_string.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `name`], 2)])
  })
})

describe(`String property <instance>.name occurs three times`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_triplicated_string.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `name`], 3)])
  })
})

describe(`Integer property <instance>.year is duplicated`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_integer.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `year`], 2)])
  })
})

describe(`Number property <instance>.weight is duplicated`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_number.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `weight`], 2)])
  })
})

describe(`Boolean property <instance>.isBoolean is duplicated`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_boolean.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `isBoolean`], 2)])
  })
})

describe(`Array of string property <instance>.pets is duplicated`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_array_of_string.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `pets`], 2)])
  })
})

describe(`Array of integer property <instance>.good_years is duplicated`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_array_of_integer.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `good_years`], 2)])
  })
})

describe(`Object property <instance>.myObject is duplicated`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_object.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `myObject`], 2)])
  })
})

describe(`Property <instance>.year is duplicated and one property contains an integer whereas the other one contains a string value`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_property_with_different_value_types.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `year`], 2)])
  })
})

describe(`Property <instance>.name is duplicated and contains the same values for each property`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_string_with_same_values.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `name`], 2)])
  })
})

describe(`Object property <instance>.myObject is duplicated and both properties have the same content`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_object_with_same_content.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `myObject`], 2)])
  })
})

describe(`Object property <instance>.myObject is duplicated and one property also has a duplicated boolean property`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_object_with_duplication_in_one_object.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `myObject`], 2), createPropertyKey([`<instance>`, `myObject`, `isBoolean`], 2)])
  })
})

describe(`Object property <instance>.myObject is duplicated and both properties also have a duplicated boolean property`, () => {
  it(`returns the expected property objects`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_object_with_duplication_in_both_objects.json`)))
    let expectedResultValues = returnExpectedResultValues(duplicatedProperties, [createPropertyKey([`<instance>`, `myObject`], 2), createPropertyKey([`<instance>`, `myObject`, `isBoolean`], 2), createPropertyKey([`<instance>`, `myObject`, `isBoolean`], 2)])
    expect(expectedResultValues).toHaveLength(3)
    expectedResultValues.forEach(expectedResultValue =>
      expect(expectedResultValue).toHaveLength(expectedResultValue.every(expectedResult => expectedResult.propertyPath.every(property =>
        [`<instance>`, `myObject`].includes(property))) ? 1 : 2)
    )
  })
})

describe(`One string property is contained by an object Object which is also contained by another object`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_string_deep_within_an_object.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `myObject`, `mySecondObject`, `name`], 2)])
  })
})

describe(`One array of string porperty is contained by an object Object which is also contained by another object`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_array_deep_within_an_object.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `myObject`, `mySecondObject`, `pets`], 2)])
  })
})

describe(`Root is duplicated`, () => {
  it(`does not validate anything as an invalid file has been passed as argument`, () => {
    let filePath = readFile(path.join(appRootPath, `./assets/test_files/root_is_duplicated.json`))
    expect(() => findDuplicatedProperties(filePath)).toThrowError(`Input is no valid JSON file.`)
  })
})

describe(`Root is a valid array`, () => {
  it(`returns an empty list`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/root_is_an_array.json`)))
    expect(duplicatedProperties).toHaveLength(0)
  })
})

describe(`Root is a an array but one of the objects contained by the array contains a duplicated string property`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/root_is_an_array_and_one_contains_a_duplicated_string.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `[1]`, `name`], 2)])
  })
})

describe(`Root is a an array but one of the objects contained by the array contains a duplicated string property whereas the other one contains a duplicated array of strings`, () => {
  it(`returns the expected property objects`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/root_is_an_array_and_both_contain_a_duplicated_property.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `[0]`, `name`], 2), createPropertyKey([`<instance>`, `[1]`, `pets`], 2)])
  })
})

describe(`Test if the toString() function of a PropertyKey object returns the expected value`, () => {
  it(`returns the expected property objects`, () => {
    let propertyKey = createPropertyKey([`<instance>`, `myObject`, `name`], 2)
    expect(propertyKey.toString()).toBe(`<instance>.myObject.name`)
  })
})

describe(`String property <instance>.name is duplicated and contains a comma within its value`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_string_with_comma_value.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `name`], 2)])
  })
})

describe(`String property <instance>.name is duplicated and contains a comma within its key`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_string_with_comma_key.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `firstname, lastname`], 2)])
  })
})

describe(`String property <instance>.name is duplicated and contains a quote within its value`, () => {
  it(`returns the expected property object`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_string_with_quote_value.json`)))
    comparePropertyKeyArrays(duplicatedProperties, [createPropertyKey([`<instance>`, `name`], 2)])
  })
})

describe(`Validate a JSON file that has an array with duplicated string values`, () => {
  it(`returns an empty list`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_string_in_array.json`)))
    expect(duplicatedProperties).toHaveLength(0)
  })
})

describe(`Validate a JSON file that has an array with duplicated object values`, () => {
  it(`returns an empty list`, () => {
    let duplicatedProperties = findDuplicatedProperties(readFile(path.join(appRootPath, `./assets/test_files/one_duplicated_object_in_array.json`)))
    expect(duplicatedProperties).toHaveLength(0)
  })
})

const readFile = (fileName) => (fs.readFileSync(fileName).toString())

const createPropertyKey = (propertyPath, occurrence) => {
  let propertyKey = PropertyKey()
  propertyKey.propertyPath = propertyPath
  propertyKey.occurrence = occurrence
  return propertyKey
}

const comparePropertyKeyArrays = (result, expected) => {
  console.log('result ' + result + ' expected ' + expected)
  let expectedResultValues = returnExpectedResultValues(result, expected)
  expectedResultValues.forEach(expectedResultValue => {
    expect(expectedResultValue).toHaveLength(1)
  })
}

const returnExpectedResultValues = (result, expected) => {
  let expectedResultValues = []
  expect(result).toHaveLength(expected.length)
  result.forEach(resultValue => {
    expectedResultValues.push(expected.filter(expectedValue => (
      resultValue.occurrence === expectedValue.occurrence &&
      expectedValue.propertyPath.length === resultValue.propertyPath.length &&
      expectedValue.propertyPath.every((property, index) => (
        property === resultValue.propertyPath[index]
      )))))
  })
  return expectedResultValues
}
