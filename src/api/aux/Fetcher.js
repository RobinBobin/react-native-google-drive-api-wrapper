import HttpError from "../../HttpError";
import { blobToByteArray } from "./utils";

/*
 * A weird workaround of an equally weird bug:
 *
 * Require cycle: node_modules/react-native/Libraries/Network/fetch.js -> node_modules/whatwg-fetch/dist/fetch.umd.js -> node_modules/react-native/Libraries/Network/fetch.js
*/

fetch;

export default class Fetcher {
  constructor(gDriveApi) {
    this.__gDriveApi = gDriveApi;
    
    this.reset();
  }
  
  appendHeader(name, value) {
    this.__init.headers.append(name, value);
    
    return this;
  }
  
  async fetch(resource, responseType) {
    if (resource) {
      this.setResource(resource);
    }
    
    if (responseType) {
      this.setResponseType(responseType);
    }
    
    let response = await fetch(this.__resource, this.__init);
    
    if (!response.ok) {
      if (this.__gDriveApi.fetchRejectsOnHttpErrors) {
        throw await HttpError.create(response);
      }
    } else if (this.__gDriveApi.fetchCoercesTypes && this.__responseType) {
      response = await response[this.__responseType]();
      
      if (this.__responseType === "blob") {
        response = blobToByteArray(response);
      }
    }
    
    return response;
  }
  
  get gDriveApi() {
    return this.__gDriveApi;
  }
  
  reset() {
    this.__init = {
      headers: new Headers()
    };
    
    this.appendHeader("Authorization", `Bearer ${this.__gDriveApi.gdrive.accessToken}`);
  }
  
  setBody(body, contentType) {
    this.__init.body = body;
    
    if (contentType) {
      this
        .appendHeader("Content-Length", body.length)
        .appendHeader("Content-Type", contentType);
    }
    
    return this;
  }
  
  setMethod(method) {
    this.__init.method = method;
    
    return this;
  }
  
  setResource(resource) {
    this.__resource = resource;
    
    return this;
  }
  
  setResponseType(responseType) {
    this.__responseType = responseType;
    
    return this;
  }
};
