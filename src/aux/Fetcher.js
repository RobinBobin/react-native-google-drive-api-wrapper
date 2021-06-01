import HttpError from "./HttpError";
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
    
    this.__init = {
      headers: new Headers()
    };
    
    this.appendHeader("Authorization", `Bearer ${gDriveApi.gdrive.accessToken}`);
  }
  
  appendHeader(name, value) {
    this.__init.headers.append(name, value);
    
    return this;
  }
  
  async fetch(resource, responseType) {
    let response = await fetch(resource, this.__init);
    
    if (!response.ok) {
      if (this.__gDriveApi.fetchRejectsOnHttpErrors) {
        throw new HttpError(await response.json(), response);
      }
    } else if (this.__gDriveApi.fetchCoercesTypes && responseType) {
      response = await response[responseType]();
      
      if (responseType === "blob") {
        response = blobToByteArray(response);
      }
    }
    
    return response;
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
};
