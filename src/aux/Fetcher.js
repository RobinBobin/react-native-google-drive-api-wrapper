/*
 * A weird workaround of an equally weird bug:
 *
 * Require cycle: node_modules/react-native/Libraries/Network/fetch.js -> node_modules/whatwg-fetch/dist/fetch.umd.js -> node_modules/react-native/Libraries/Network/fetch.js
*/

fetch;

export default class Fetcher {
  constructor(accessToken) {
    this.__init = {
      headers: new Headers()
    };
    
    this.appendHeader("Authorization", `Bearer ${accessToken}`);
  }
  
  appendHeader(name, value) {
    this.__init.headers.append(name, value);
    
    return this;
  }
  
  fetch(resource) {
    return fetch(resource, this.__init);
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
