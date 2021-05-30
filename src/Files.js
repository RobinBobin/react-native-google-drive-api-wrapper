import GDriveApi from "./GDriveApi";
import {
  Uris,
  blobToByteArray
} from "./utils";

export default class Files extends GDriveApi {
  constructor() {
    super();
    
    this.__multipartBoundary = "foo_bar_baz";
  }
  
  delete(fileId) {
    return this.fetch(Uris.files(fileId), {method: "DELETE"});
  }
  
  get(fileId, queryParams) {
    return this.fetch(Uris.files(fileId, queryParams));
  }
  
  getBinary(fileId, queryParams) {
    return this.__getContent(fileId, queryParams, "blob")
  }
  
  getContent(fileId, queryParams) {
    return this.__getContent(fileId, queryParams);
  }
  
  getJson(fileId, queryParams) {
    return this.__getContent(fileId, queryParams, "json");
  }
  
  async getMetadata(fileId, queryParams) {
    const _queryParams = {...queryParams};
    
    delete _queryParams.alt;
    
    return (await this.get(fileId, _queryParams)).json();
  }
  
  getText(fileId, queryParams) {
    return this.__getContent(fileId, queryParams, "text");
  }
  
  list(queryParams) {
    return this.fetch(Uris.files(null, queryParams));
  }
  
  get multipartBoundary() {
    return this.__multipartBoundary;
  }
  
  set multipartBoundary(multipartBoundary) {
    this.__multipartBoundary = multipartBoundary;
  }
  
  async __getContent(fileId, queryParams, type) {
    let content = await this.get(fileId, {
      ...queryParams,
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
