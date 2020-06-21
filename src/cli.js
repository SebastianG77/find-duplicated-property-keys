#!/usr/bin/env node
import chalk from 'chalk'
import commandLineArgs from 'command-line-args'
import commandLineUsage from 'command-line-usage'
import fs from 'fs'

import findDuplicatedPropertyKeys from './index'

const sections = [
  {
    header: 'A tool for detecting duplicates in JSON files.',
    content: 'Lists all duplicated property keys followed by the number of their occurrence.'
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
    const jsonFile = options.src
    if (fs.existsSync(jsonFile)) {
      if (fs.lstatSync(jsonFile).isFile()) {
        const content = fs.readFileSync(jsonFile).toString()
        const duplicatedPropertyKeys = findDuplicatedPropertyKeys(content)
        if (duplicatedPropertyKeys != null) {
          if (duplicatedPropertyKeys.length === 0) {
            console.log(chalk.green(`No duplicated property keys found in ${options.src}.`))
          } else {
            console.log(chalk.red(`The following duplicated property keys have been detected in ${options.src}:\n${duplicatedPropertyKeys.map(duplicatedPropertyKey => `${duplicatedPropertyKey} (${duplicatedPropertyKey.occurrence})`).join('\n')}`))
          }
        }
      } else {
        throw new Error(`Path ${jsonFile} does not point to a file.`)
      }
    } else {
      throw new Error(`File ${jsonFile} does not exist.`)
    }
  }
}

runCli(options)
