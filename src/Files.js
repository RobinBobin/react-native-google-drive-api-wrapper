import GDriveApi from "./GDriveApi";
import { Uris } from "./utils";

export default class Files extends GDriveApi {
  constructor() {
    super();
    
    this.__multipartBoundary = "foo_bar_baz";
  }
  
  delete(fileId) {
    return fetch(
      Uris.files(fileId), {
        headers: this.createHeaders(),
        method: "DELETE"
    });
  }
  
  get(fileId, queryParams) {
    return fetch(
      Uris.files(fileId, queryParams), {
        headers: this.createHeaders()
      });
  }
  
  list(queryParams) {
    return fetch(
      Uris.files(null, queryParams), {
        headers: this.createHeaders()
      });
  }
  
  get multipartBoundary() {
    return this.__multipartBoundary;
  }
  
  set multipartBoundary(multipartBoundary) {
    this.__multipartBoundary = multipartBoundary;
  }
};
