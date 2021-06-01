import Fetcher from "./aux/Fetcher";

export default class GDriveApi {
  constructor() {
    this.fetchCoercesTypes = true;
    this.fetchRejectsOnHttpErrors = true;
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
  
  get gdrive() {
    return this.__gdrive;
  }
  
  set gdrive(gdrive) {
    this.__gdrive = gdrive;
  }
};
