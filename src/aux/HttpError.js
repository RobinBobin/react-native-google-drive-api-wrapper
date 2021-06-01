export default class HttpError extends Error {
  constructor(json, result) {
    super();
    
    this.__json = json;
    this.__result = result;
  }
  
  get json() {
    return this.__json;
  }
  
  get result() {
    return this.__result;
  }
  
  toString() {
    return `HttpError: ${JSON.stringify(this.result)} ${JSON.stringify(this.json)}`;
  }
}
