import commandLineArgs from 'command-line-args'
import commandLineUsage from 'command-line-usage'
import fs from 'fs'

import { findDuplicatedProperties } from './index'

const sections = [
  {
    header: 'A tool for detecting duplicates in JSON files.',
    content: 'Returns a list of duplicated property keys.'
  },
  {
    header: 'Options',
    optionList: [
      {
        alias: 'h',
        name: 'help',
        type: Boolean,
        typeLabel: '{underline boolean}',
        description: 'Print this usage guide.'
      },
      {
        alias: 's',
        name: 'src',
        type: String,
        typeLabel: '{underline file}',
        description: 'The path to the JSON file. This parameter must be set to run this tool.'
      }
    ]
  }
]

const options = commandLineArgs(sections[1].optionList)

const runCli = (options) => {
  if (options == null || options.src == null) {
    console.log(commandLineUsage(sections))
  } else {
    let jsonFile = options.src
    if (fs.existsSync(jsonFile)) {
      let content = fs.readFileSync(jsonFile).toString()
      let duplicatedPropertyKeys = findDuplicatedProperties(content)
      if (duplicatedPropertyKeys != null) {
        console.log(duplicatedPropertyKeys.toString())
      }
    } else {
      throw new Error(`File ${jsonFile} does not exist.`)
    }
  }
}

runCli(options)
