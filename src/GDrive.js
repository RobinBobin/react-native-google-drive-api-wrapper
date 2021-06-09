import About from "./api/About";
import Files from "./api/Files";

export default class GDrive {
  constructor() {
    this.about = new About();
    this.files = new Files();
  }
  
  get about() {
    return this.__about;
  }
  
  set about(about) {
    this.__about = about;
    
    this.__about.gdrive = this;
  }
  
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
