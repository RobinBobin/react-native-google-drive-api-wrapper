import { blobToByteArray } from "./utils";
import GDriveApi from "../GDriveApi";
import HttpError from "../../HttpError";

/*
 * A weird workaround of an equally weird bug:
 *
 * Require cycle: node_modules/react-native/Libraries/Network/fetch.js -> node_modules/whatwg-fetch/dist/fetch.umd.js -> node_modules/react-native/Libraries/Network/fetch.js
*/

fetch;

export type BodyType = Uint8Array | string;

export type FetchResponseType = "blob" | "json" | "text";

export default class Fetcher <SomeGDriveApi extends GDriveApi> {
  private readonly __abortController: AbortController;
  private readonly __gDriveApi: SomeGDriveApi;
  private readonly __init: RequestInit;
  private __resource?: RequestInfo;
  private __responseType?: FetchResponseType;
  
  constructor(gDriveApi: SomeGDriveApi) {
    this.__abortController = new AbortController();
    this.__gDriveApi = gDriveApi;
    
    this.__init = {
      headers: new Headers(),
      signal: this.__abortController.signal
    };
    
    this.appendHeader("Authorization", `Bearer ${this.gDriveApi.accessToken}`);
  }
  
  appendHeader(name: string, value: any) {
    (this.__init.headers as Headers).append(name, value);
    
    return this;
  }
  
  async fetch(resource?: RequestInfo, responseType?: FetchResponseType) {
    if (resource) {
      this.setResource(resource);
    }
    
    if (responseType) {
      this.setResponseType(responseType);
    }
    
    if (this.gDriveApi.fetchTimeout >= 0) {
      setTimeout(() => this.__abortController.abort(), this.gDriveApi.fetchTimeout);
    }
    
    let response = await fetch(this.__resource as RequestInfo, this.__init);
    
    if (!response.ok) {
      if (this.gDriveApi.fetchRejectsOnHttpErrors) {
        throw await HttpError.create(response);
      }
      
      return response;
    }
    
    if (!(this.gDriveApi.fetchCoercesTypes && this.__responseType)) {
      return response;
    }
    
    const result = await response[this.__responseType]();
    
    return this.__responseType === "blob" ? blobToByteArray(result) : result;
  }
  
  get gDriveApi() {
    return this.__gDriveApi;
  }
  
  setBody(body: BodyType, contentType?: string) {
    this.__init.body = body;
    
    if (contentType) {
      this
        .appendHeader("Content-Length", body.length)
        .appendHeader("Content-Type", contentType);
    }
    
    return this;
  }
  
  setMethod(method: string) {
    this.__init.method = method;
    
    return this;
  }
  
  setResource(resource: RequestInfo) {
    this.__resource = resource;
    
    return this;
  }
  
  setResponseType(responseType: FetchResponseType) {
    this.__responseType = responseType;
    
    return this;
  }
};

async function exportedFetch <SomeGDriveApi extends GDriveApi> (
  gDriveApi: SomeGDriveApi,
  resource: RequestInfo,
  responseType: FetchResponseType
) {
  return new Fetcher(gDriveApi).fetch(resource, responseType);
}

export { exportedFetch as fetch };
