import { ArrayStringifier, StaticUtils } from 'simple-common-utils'
import utf8 from 'utf8'
import Uploader from './Uploader'
import Fetcher, { BodyType, FetchResultType } from '../Fetcher'
import FilesApi from '../../files/FilesApi'
import MimeTypes from '../../../MimeTypes'

export default class MultipartUploader extends Uploader {
  constructor(fetcher: Fetcher<FilesApi>) {
    super(fetcher, 'multipart')
  }

  protected _execute(): FetchResultType {
    const dashDashBoundary = `--${this.fetcher.gDriveApi.multipartBoundary}`
    const ending = `\n${dashDashBoundary}--`

    let body: BodyType | string[] = [
      `\n${dashDashBoundary}\n`,
      `Content-Type: ${MimeTypes.JSON_UTF8}\n\n`,
      `${this.requestBody}\n\n${dashDashBoundary}\n`,
    ]

    if (this.isBase64) {
      body.push('Content-Transfer-Encoding: base64\n')
    }

    body.push(`Content-Type: ${this.dataType}\n\n`)

    body = new ArrayStringifier().setArray(body).setSeparator('').process()

    if (typeof this.data === 'string') {
      body += `${this.data}${ending}`
    } else {
      const converter = Array.isArray(this.data) ? (ar: number[]) => ar : Array.from

      const encodedBody = utf8.encode(body)
      const encodedEnding = utf8.encode(ending)

      const byteArray = StaticUtils.encodedUtf8ToByteArray(encodedBody)
        .concat(converter(this.data!))
        .concat(StaticUtils.encodedUtf8ToByteArray(encodedEnding))

      body = new Uint8Array(byteArray)
    }

    return this.fetcher
      .appendHeader('Content-Length', body.length.toString())
      .appendHeader(
        'Content-Type',
        `multipart/related; boundary=${this.fetcher.gDriveApi.multipartBoundary}`,
      )
      .setBody(body as BodyType)
      .fetch()
  }
}
