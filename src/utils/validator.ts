import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { AxiosResponse } from 'axios'

import { diff } from 'json-diff'

import axios from '../services/Axios'

export class Validator {
  constructor(
    private urls: string[],
    private method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    private headers?: object,
    private data?: object,
    private file?: string,
    private ignore?: string[]
  ) {}

  public execute = async () => {
    const responses = {
      original: await axios({
        url: this.urls[0],
        method: this.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept-Encoding': '*',
          ...this.headers
        },
        data: this.data
      }),
      compare: await axios({
        url: this.urls[1],
        method: this.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept-Encoding': '*',
          ...this.headers,
        },
        data: this.data
      })
    }

    return responses
  }

  public compare = ({ original, compare }: { original: AxiosResponse; compare: AxiosResponse }) => {
    const route = original.config.url?.replace(
      /^[^:]+:\/\/[^/?#]+\//,
      ''
    ).split(/\//).join('\\') ?? ''

    let originalData = original.data
    let compareData = compare.data

    const difference = diff(originalData, compareData)

    if (original.data === compare.data) {
      return console.info('[INFO]: all data is ok!')
    }

    if (!existsSync('config')) {
      mkdirSync('config')
    }

    mkdirSync(`config/responses`, { recursive: true })
    mkdirSync(`config/responses/${this.file}`, { recursive: true })

    writeFileSync(`config/responses/${this.file}/${route}.json`, JSON.stringify(difference, null, 4))
  }
}
