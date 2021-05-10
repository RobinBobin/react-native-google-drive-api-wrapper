export default class GDrive {
  get accessToken() {
    return this.__accessToken;
  }
  
  set accessToken(accessToken) {
    this.__accessToken = accessToken;
  }
  
  get files() {
    return this.__files;
  }
  
  set files(files) {
    this.__files = files;
    
    this.__files.gdrive = this;
  }
};
