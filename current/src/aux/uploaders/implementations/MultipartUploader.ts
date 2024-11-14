import type { IFileOutput } from '../../../api/files/types'
import type { Fetcher } from '../../Fetcher'
import type { TBodyType } from '../../Fetcher/types'

import { mimeTypes } from '@robinbobin/mimetype-constants'
import { isString } from 'radashi'
import { encode } from 'utf8'

import { UploaderWithSimpleData } from '../base/UploaderWithSimpleData'

export class MultipartUploader extends UploaderWithSimpleData {
  private isBase64 = false
  private multipartBoundary = 'foo_bar_baz'

  constructor(fetcher: Readonly<Fetcher>) {
    super(fetcher, 'multipart')
  }

  setIsBase64(isBase64: boolean): UploaderWithSimpleData {
    this.isBase64 = isBase64

    return this
  }

  setMultipartBoundary(multipartBoundary: string): UploaderWithSimpleData {
    this.multipartBoundary = multipartBoundary

    return this
  }

  protected _execute(): Promise<IFileOutput> {
    const dashDashBoundary = `--${this.multipartBoundary}`
    const ending = `\n${dashDashBoundary}--`

    let body: TBodyType | string[] = [
      `\n${dashDashBoundary}\n`,
      `Content-Type: ${mimeTypes.application.json}\n\n`,
      `${this.requestBody}\n\n${dashDashBoundary}\n`
    ]

    if (this.isBase64) {
      body.push('Content-Transfer-Encoding: base64\n')
    }

    body.push(`Content-Type: ${this.dataMimeType}\n\n`)

    body = body.join('')

    if (isString(this.data)) {
      body += `${this.data}${ending}`
    } else {
      const convertStringToNumberArray = (string: string): number[] => {
        const index = 0

        return encode(string)
          .split('')
          .map(char => char.charCodeAt(index))
      }

      body = new Uint8Array(
        convertStringToNumberArray(body)
          .concat(Array.from(this.data))
          .concat(convertStringToNumberArray(ending))
      )
    }

    return this.fetcher
      .appendHeader('Content-Length', body.length.toString())
      .appendHeader(
        'Content-Type',
        `multipart/related; boundary=${this.multipartBoundary}`
      )
      .setBody(body)
      .fetchJson()
  }
}
