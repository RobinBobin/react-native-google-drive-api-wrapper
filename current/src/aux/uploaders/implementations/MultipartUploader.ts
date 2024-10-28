import utf8 from 'utf8'
import { UploaderWithSimpleData } from '../base/UploaderWithSimpleData'
import { Fetcher } from 'aux/Fetcher'
import type { TBodyType } from 'aux/Fetcher/types'
import { MimeType } from 'src/MimeType'
import type { TJson } from 'src/types'

export class MultipartUploader extends UploaderWithSimpleData {
  private isBase64 = false
  private multipartBoundary = 'foo_bar_baz'

  constructor(fetcher: Fetcher) {
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

  protected _execute(): Promise<TJson> {
    const dashDashBoundary = `--${this.multipartBoundary}`
    const ending = `\n${dashDashBoundary}--`

    let body: TBodyType | string[] = [
      `\n${dashDashBoundary}\n`,
      `Content-Type: ${MimeType.JSON_UTF8}\n\n`,
      `${this.requestBody}\n\n${dashDashBoundary}\n`
    ]

    if (this.isBase64) {
      body.push('Content-Transfer-Encoding: base64\n')
    }

    body.push(`Content-Type: ${this.dataMimeType}\n\n`)

    body = body.join('')

    if (typeof this.data === 'string') {
      body += `${this.data}${ending}`
    } else {
      const byteArray = [body, this.data, ending].reduce<number[]>(
        (previousValue, rawCurrentValue) => {
          const isString = typeof rawCurrentValue === 'string'

          const processedCurrentValue =
            isString ?
              utf8
                .encode(rawCurrentValue)
                .split('')
                .map(char => char.charCodeAt(0))
            : Array.from(rawCurrentValue)

          previousValue.push(...processedCurrentValue)

          return previousValue
        },
        []
      )

      body = new Uint8Array(byteArray)
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
