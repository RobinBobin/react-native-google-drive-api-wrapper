import About from "./api/About";
import Files from "./api/Files";
import Permissions from "./api/Permissions";

export default class GDrive {
  constructor() {
    this.about = new About();
    this.files = new Files();
    this.permissions = new Permissions();
  }
  
  get about() {
    return this.__about;
  }
  
  set about(about) {
    this.__setApi(about, "about");
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
    this.__setApi(files, "files");
  }
  
  get permissions() {
    return this.__permissions;
  }
  
  set permissions(permissions) {
    this.__setApi(permissions, "permissions");
  }
  
  __setApi(api, apiName) {
    api.gdrive = this;
    
    this[`__${apiName}`] = api;
  }
};
