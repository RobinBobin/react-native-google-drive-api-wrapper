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
  
  // copy(fileId, queryParameters) {
    
  // }
  
  delete(fileId) {
    return this.fetch(Uris.files(fileId), {method: "DELETE"});
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
  
  emptyTrash() {
    return this.fetch(Uris.files(null, "trash"), {method: "DELETE"});
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
