import GDriveApi from "./GDriveApi";
import MimeTypes from "./aux/MimeTypes";
import Uris from "./aux/Uris";
import { blobToByteArray } from "./aux/utils";

export default class Files extends GDriveApi {
  constructor() {
    super();
    
    this.__multipartBoundary = "foo_bar_baz";
  }
  
  copy(fileId, queryParameters, requestBody = {}) {
    return this.createFetcher()
      .setBody(JSON.stringify(requestBody), MimeTypes.JSON)
      .setMethod("POST")
      .fetch(Uris.files(fileId, "copy", null, queryParameters));
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
  
  async export(fileId, queryParameters) {
    return (await this.fetch(Uris.files(fileId, "export", null, queryParameters))
    ).text();
  }
  
  async generateIds(queryParameters) {
    return (await this.fetch(Uris.files(null, "generateIds", null, queryParameters))).json();
  }
  
  get(fileId, queryParameters) {
    return this.fetch(Uris.files(fileId, null, null, queryParameters));
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
  
  async getMetadata(fileId, queryParameters) {
    const _queryParameters = {...queryParameters};
    
    delete _queryParameters.alt;
    
    return (await this.get(fileId, _queryParameters)).json();
  }
  
  getText(fileId, queryParameters) {
    return this.__getContent(fileId, queryParameters, "text");
  }
  
  list(queryParameters) {
    return this.fetch(Uris.files(null, null, null, queryParameters));
  }
  
  get multipartBoundary() {
    return this.__multipartBoundary;
  }
  
  set multipartBoundary(multipartBoundary) {
    this.__multipartBoundary = multipartBoundary;
  }
  
  async __getContent(fileId, queryParameters, type) {
    let content = await this.get(fileId, {
      ...queryParameters,
      alt: "media"
    });
    
    if (type) {
      content = await content[type]();
      
      if (type == "blob") {
        content = blobToByteArray(content);
      }
    }
    
    return content;
  }
};
