import GDriveApi from '../GDriveApi'

export default class FilesApi extends GDriveApi {
  private __multipartBoundary = 'foo_bar_baz'

  get multipartBoundary() {
    return this.__multipartBoundary
  }

  set multipartBoundary(multipartBoundary) {
    this.__multipartBoundary = multipartBoundary
  }
}
