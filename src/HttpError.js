export default class HttpError extends Error {
  constructor(response) {
    super();
    
    this.__response = response;
  }
  
  static async create(response) {
    const error = new HttpError(response);
    
    error.text = await response.text();
    
    try {
      error.json = JSON.parse(error.text);
    } catch (error) {
      // Nothing to do.
    }
    
    return error;
  }
  
  get json() {
    return this.__json;
  }
  
  set json(json) {
    this.__json = json;
  }
  
  get response() {
    return this.__response;
  }
  
  get text() {
    return this.__text;
  }
  
  set text(text) {
    this.__text = text;
  }
  
  toString() {
    return `HttpError: ${JSON.stringify(this.response)} ${this.json ? JSON.stringify(this.json) : this.text}`;
  }
}
