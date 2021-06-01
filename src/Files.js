import GDriveApi from "./GDriveApi";
import MimeTypes from "./aux/MimeTypes";
import Uris from "./aux/Uris";

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
  
  delete(fileId) {
    return this.createFetcher()
      .setMethod("DELETE")
      .fetch(Uris.files(fileId));
  }
  
  emptyTrash() {
    return this.createFetcher()
      .setMethod("DELETE")
      .fetch(Uris.files(null, "trash"));
  }
  
  export(fileId, queryParameters) {
    return this.fetch(Uris.files(fileId, "export", null, queryParameters), "text");
  }
  
  generateIds(queryParameters) {
    return this.fetch(Uris.files(null, "generateIds", null, queryParameters), "json");
  }
  
  get(fileId, queryParameters) {
    return this.__get(fileId, queryParameters);
  }
  
  getBinary(fileId, queryParameters) {
    return this.__getContent(fileId, queryParameters, "blob")
  }
  
  getContent(fileId, queryParameters) {
    return this.__getContent(fileId, queryParameters);
  }
  
  getJson(fileId, queryParameters) {
    return this.__getContent(fileId, queryParameters, "json");
  }
  
  getMetadata(fileId, queryParameters) {
    return this.__get(
      fileId, {
        ...queryParameters,
        alt: "json"
      },
      "json");
  }
  
  getText(fileId, queryParameters) {
    return this.__getContent(fileId, queryParameters, "text");
  }
  
  list(queryParameters) {
    return this.fetch(Uris.files(null, null, null, queryParameters), "json");
  }
  
  get multipartBoundary() {
    return this.__multipartBoundary;
  }
  
  set multipartBoundary(multipartBoundary) {
    this.__multipartBoundary = multipartBoundary;
  }
  
  __get(fileId, queryParameters, responseType) {
    return this.fetch(Uris.files(fileId, null, null, queryParameters), responseType);
  }
  
  __getContent(fileId, queryParameters, responseType) {
    return this.__get(
      fileId, {
        ...queryParameters,
        alt: "media"
      },
      responseType,
      !!responseType
    );
  }
};
