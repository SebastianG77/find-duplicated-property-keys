import fs from 'fs'
import isJSON from 'is-json'
import path from 'path'

export const findRedundantProperties = () => {
  console.log('startme2')
  let jsonFile = `./assets/test.json`  
  if (fs.existsSync(jsonFile)) {
    let jsonFileString = fs.readFileSync(jsonFile)
    if (isJSON(jsonFileString, true)) {
      console.log('isjson')
    } else {
      console.log('isnojson')
    }
  } else {
    console.log(`ERROR: File ${jsonFile} does not exist.`)
  }
}

findRedundantProperties()
