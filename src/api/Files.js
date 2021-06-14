import GDriveApi from "./GDriveApi";
import Uploader from "./aux/Uploader";
import Uris from "./aux/Uris";
import MimeTypes from "../MimeTypes";
import UnexpectedFileCountError from "../UnexpectedFileCountError";

export default class Files extends GDriveApi {
  constructor() {
    super();
    
    this.__multipartBoundary = "foo_bar_baz";
  }
  
  copy(fileId, queryParameters, requestBody = {}) {
    return this.createFetcher()
      .setBody(JSON.stringify(requestBody), MimeTypes.JSON)
      .setMethod("POST")
      .fetch(Uris.files(fileId, "copy", null, queryParameters), "json");
  }
  
  async createIfNotExists(queryParameters, uploader) {
    uploader.setIdOfFileToUpdate();
    
    const result = {};
    
    const files = (await this.list(queryParameters)).files;
    
    switch (files.length) {
      case 0:
        result.alreadyExisted = false;
        result.result = await uploader.execute();
        
        break;
      
      case 1:
        result.alreadyExisted = true;
        result.result = files[0];
        
        break;
      
      default:
        throw new UnexpectedFileCountError([0, 1], files.length);
    }
    
    return result;
  }
  
  delete(fileId) {
    return this.createFetcher()
      .setMethod("DELETE")
      .fetch(Uris.files(fileId), "text");
  }
  
  emptyTrash() {
    return this.createFetcher()
      .setMethod("DELETE")
      .fetch(Uris.files(null, "trash"), "text");
  }
  
  export(fileId, queryParameters) {
    return this.fetch(Uris.files(fileId, "export", null, queryParameters), "text");
  }
  
  generateIds(queryParameters) {
    return this.fetch(Uris.files(null, "generateIds", null, queryParameters), "json");
  }
  
  get(fileId, queryParameters, range) {
    return this.__get(fileId, queryParameters, range);
  }
  
  getBinary(fileId, queryParameters, range) {
    return this.__getContent(fileId, queryParameters, range, "blob")
  }
  
  getContent(fileId, queryParameters, range) {
    return this.__getContent(fileId, queryParameters, range);
  }
  
  getJson(fileId, queryParameters) {
    return this.__getContent(fileId, queryParameters, null, "json");
  }
  
  getMetadata(fileId, queryParameters = {}) {
    queryParameters.alt = "json";
    
    return this.__get(fileId, queryParameters, null, "json");
  }
  
  getText(fileId, queryParameters, range) {
    return this.__getContent(fileId, queryParameters, range, "text");
  }
  
  list(queryParameters) {
    let _queryParameters = queryParameters;
    
    if (_queryParameters?.q && (_queryParameters.q.constructor !== String)) {
      _queryParameters = {
        ..._queryParameters,
        q: _queryParameters.q.toString()
      };
    }
    
    return this.fetch(Uris.files(null, null, null, _queryParameters), "json");
  }
  
  get multipartBoundary() {
    return this.__multipartBoundary;
  }
  
  set multipartBoundary(multipartBoundary) {
    this.__multipartBoundary = multipartBoundary;
  }
  
  newMediaUploader() {
    return new Uploader(this.createFetcher(), "media");
  }
  
  newMetadataOnlyUploader() {
    return new Uploader(this.createFetcher());
  }
  
  newMultipartUploader() {
    return new Uploader(this.createFetcher(), "multipart");
  }
  
  // newResumableUploader() {
  //   return new Uploader(this.createFetcher(), "resumable");
  // }
  
  __get(fileId, queryParameters, range, responseType) {
    const fetcher = this.createFetcher();
    
    if (range) {
      fetcher.appendHeader("Range", `bytes=${range}`);
    }
    
    return fetcher.fetch(Uris.files(fileId, null, null, queryParameters), responseType);
  }
  
  __getContent(fileId, queryParameters, range, responseType) {
    return this.__get(
      fileId, {
        ...queryParameters,
        alt: "media"
      },
      range,
      responseType);
  }
};
