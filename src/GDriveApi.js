/*
 * A weird workaround of an equally weird bug:
 *
 * Require cycle: node_modules/react-native/Libraries/Network/fetch.js -> node_modules/whatwg-fetch/dist/fetch.umd.js -> node_modules/react-native/Libraries/Network/fetch.js
*/

fetch;

export default class GDriveApi {
  // createHeaders(contentType, contentLength) {
  //   const headers = new Headers();
    
  //   for (const data of [
  //     ["Content-Type", contentType],
  //     ["Content-Length", contentLength]
  //   ]) {
  //     if (data[1] !== undefined) {
  //       headers.append(data[0], data[1]);
  //     }
  //   }
    
  //   return headers;
  // }
  
  fetch(input, init) {
    const _init = {...init};
    
    if (!_init.headers) {
      _init.headers = new Headers();
    }
    
    if (!_init.headers.has("Authorization")) {
      _init.headers.append("Authorization", `Bearer ${this.__gdrive.accessToken}`);
    }
    
    return fetch(input, _init);
  }
  
  set gdrive(gdrive) {
    this.__gdrive = gdrive;
  }
};
