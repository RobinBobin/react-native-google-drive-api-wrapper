import GDriveApi from "./GDriveApi";
import { Uris } from "./utils";

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
  
  list(queryParams) {
    return this.fetch(Uris.files(null, queryParams));
  }
  
  get multipartBoundary() {
    return this.__multipartBoundary;
  }
  
  set multipartBoundary(multipartBoundary) {
    this.__multipartBoundary = multipartBoundary;
  }
};
