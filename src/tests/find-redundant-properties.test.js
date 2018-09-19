import { findRedundantProperties } from '../index.js'
import path from 'path'
import appRoot from 'app-root-path'

const { describe, expect, it } = global

let appRootPath = appRoot.toString()

describe(`Validate a JSON file that does not contain any duplicates`, () => {
  it(`returns an empty list`, () => {
    let duplicatedProperties = findRedundantProperties(path.join(appRootPath, `./assets/test_files/valid_JSON_file.json`))
    expect(duplicatedProperties).toHaveLength(0)
  })
})
