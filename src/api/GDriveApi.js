import Fetcher from "./aux/Fetcher";

export default class GDriveApi {
  constructor() {
    this.fetchCoercesTypes = true;
    this.fetchRejectsOnHttpErrors = true;
    this.fetchTimeout = 1500;
  }
  
  createFetcher() {
    return new Fetcher(this);
  }
  
  fetch(resource, responseType) {
    return this.createFetcher().fetch(resource, responseType);
  }
  
  get fetchCoercesTypes() {
    return this.__fetchCoercesTypes;
  }
  
  set fetchCoercesTypes(fetchCoercesTypes) {
    this.__fetchCoercesTypes = fetchCoercesTypes;
  }
  
  get fetchRejectsOnHttpErrors() {
    return this.__fetchRejectsOnHttpErrors;
  }
  
  set fetchRejectsOnHttpErrors(fetchRejectsOnHttpErrors) {
    this.__fetchRejectsOnHttpErrors = fetchRejectsOnHttpErrors;
  }
  
  get fetchTimeout() {
    return this.__fetchTimeout;
  }
  
  set fetchTimeout(fetchTimeout) {
    this.__fetchTimeout = fetchTimeout;
  }
  
  get gdrive() {
    return this.__gdrive;
  }
  
  set gdrive(gdrive) {
    this.__gdrive = gdrive;
  }
};
