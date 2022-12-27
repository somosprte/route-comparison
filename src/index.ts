#! /usr/bin/env node

import { existsSync, readFileSync } from 'fs'

import { readdirSync, statSync } from 'fs'
import { parse } from 'yaml'

import { Validator } from './utils/validator'
import { Request } from './schema/request'

const startComparison = async () => {
  let config = process.argv.map((flag) => {
    return flag.replace(/(--?|-?)+[A-Za-z]+=/, '')
  })[2]

  if (!config) {
    throw new Error('please provide a config file or directory')
  }

  if (!existsSync(config)) {
    throw new Error(`cannot find config file or directory`)
  }

  const configDatas: { fileName: string; request: Request }[] = []

  if (statSync(config).isDirectory()) {
    const files = readdirSync(config)

    for await (const file of files) {
      configDatas.push({
        fileName: file.split('.')[0],
        request: parse(String(readFileSync(config.startsWith('/') ? `${config}/${file}` : `./${config}/${file}`))) as Request
      })
    }
  } else {
    configDatas.push({
      fileName: config.split('/')[config.split('/').length - 1].split('.')[0],
      request: parse(String(readFileSync(config.startsWith('/') ? config : `./${config}`))) as Request
    })
  }

  for await (const { fileName, request } of configDatas) {
    const original = request['servers'].original
    const compare = request['servers'].compare
  
    Object.values(request.requests).forEach(async (request) => {
      const validator = new Validator(
        [
          original + (request.url ?? request.urls![0]),
          compare + (request.url ?? request.urls![1])
        ],
        request.method,
        request.headers,
        request.data,
        fileName,
        JSON.parse(request.ignore ?? '[]')
      )
  
      const responses = await validator.execute()
  
      validator.compare(responses)
    })
  }
}

startComparison()
