import Uploader from './Uploader'
import { FetchResultType } from '../Fetcher'
import MimeTypes from '../../../MimeTypes'

export default class MetadataOnlyUploader extends Uploader {
  protected _execute(): FetchResultType {
    return this.fetcher.setBody(this.requestBody as string, MimeTypes.JSON).fetch()
  }
}
