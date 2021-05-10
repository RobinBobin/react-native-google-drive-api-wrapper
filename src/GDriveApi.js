export default class GDriveApi {
  createHeaders(contentType, contentLength) {
    const headers = new Headers();
    
    for (const data of [
      ["Authorization", `Bearer ${this.__gdrive.accessToken}`],
      ["Content-Type", contentType],
      ["Content-Length", contentLength]
    ]) {
      if (data[1] !== undefined) {
        headers.append(data[0], data[1]);
      }
    }
    
    return headers;
  }
  
  set gdrive(gdrive) {
    this.__gdrive = gdrive;
  }
};
