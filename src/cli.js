import commandLineArgs from 'command-line-args'
import commandLineUsage from 'command-line-usage'

import { findRedundantProperties } from './index'

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

const run = (options) => {
  if (options.src != null) {
    return findRedundantProperties(options.src)
  } else {
    console.log(commandLineUsage(sections))
  }
}

run(options)
