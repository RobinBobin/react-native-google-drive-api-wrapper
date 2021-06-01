import Fetcher from "./aux/Fetcher";

export default class GDriveApi {
  createFetcher() {
    return new Fetcher(this.__gdrive.accessToken);
  }
  
  fetch(resource) {
    return this.createFetcher().fetch(resource);
  }
  
  set gdrive(gdrive) {
    this.__gdrive = gdrive;
  }
};
