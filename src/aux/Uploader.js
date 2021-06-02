import { StaticUtils } from "simple-common-utils";
import utf8 from "utf8";
import Uris from "./Uris";

export default class Uploader {
  constructor(fetcher, uploadType) {
    this.__fetcher = fetcher;
    this.__queryParameters = {uploadType};
  }
  
  execute() {
    const isResumable = this.__queryParameters.uploadType === "resumable";
    const preDrivePath = this.__queryParameters.uploadType ? "upload" : null;
    
    this.__fetcher
      .setMethod(this.__fileId ? "PATCH" : "POST")
      .setResource(Uris.files(this.__fileId, null, preDrivePath, this.__queryParameters));
    
    if (!isResumable) {
      this.__fetcher.setResponseType("json");
    }
    
    let result;
    
    if (this.__queryParameters.uploadType === "media") {
      result = this.__fetcher
        .setBody(this.__data, this.__dataType)
        .fetch();
    } else if (this.__queryParameters.uploadType === "multipart" || !preDrivePath) {
      
    } else if (isResumable) {
      
    } else {
      throw new Error(`Invalid upload type: '${this.__queryParameters.uploadType}'`);
    }
    
    return result;
  }
  
  setData(data, dataType) {
    this.__data = data;
    this.__dataType = dataType;
    
    if (this.__data.constructor !== String) {
      this.__data = new Uint8Array(this.__data);
    }
    
    return this;
  }
  
  setFileId(fileId) {
    this.__fileId = fileId;
    
    return this;
  }
  
  setQueryParameters(queryParameters) {
    this.__queryParameters = {
      ...queryParameters,
      uploadType: this.__queryParameters.uploadType
    };
    
    return this;
  }
  
  setRequestBody(requestBody) {
    this.__requestBody = requestBody;
    
    return this;
  }
};
