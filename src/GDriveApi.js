import Fetcher from "./aux/Fetcher";

export default class GDriveApi {
  createFetcher() {
    return new Fetcher(this.__gdrive.accessToken);
  }
  
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
  
  set gdrive(gdrive) {
    this.__gdrive = gdrive;
  }
};
