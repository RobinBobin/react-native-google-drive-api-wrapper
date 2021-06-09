import {
  ArrayStringifier,
  StaticUtils
} from "simple-common-utils";
import utf8 from "utf8";
import Uris from "./Uris";
import MimeTypes from "../../MimeTypes";

export default class Uploader {
  constructor(fetcher, uploadType) {
    this.__fetcher = fetcher;
    this.__queryParameters = {uploadType};
  }
  
  execute() {
    /**
     * 'uploadType' will be present, but undefined for metadata-only uploads.
     */
    if (!this.__queryParameters.uploadType) {
      delete this.__queryParameters.uploadType;
    }
    
    const dataIsString = this.__data?.constructor === String;
    const isResumable = this.__queryParameters.uploadType === "resumable";
    const preDrivePath = this.__queryParameters.uploadType ? "upload" : null;
    const requestBody = JSON.stringify(this.__requestBody ?? {});
    
    this.__fetcher
      .setMethod(this.__fileId ? "PATCH" : "POST")
      .setResource(Uris.files(this.__fileId, null, preDrivePath, this.__queryParameters));
    
    if (!isResumable) {
      this.__fetcher.setResponseType("json");
    }
    
    let result;
    
    if (this.__queryParameters.uploadType === "media" || !preDrivePath) {
      result = this.__fetcher
        .setBody(
          dataIsString ? this.__data : preDrivePath ? new Uint8Array(this.__data) : requestBody,
          this.__dataType ?? MimeTypes.JSON)
        .fetch();
    } else if (this.__queryParameters.uploadType === "multipart") {
      const dashDashBoundary = `--${this.__fetcher.gDriveApi.multipartBoundary}`;
      const ending = `\n${dashDashBoundary}--`;
      
      let body = [
        `\n${dashDashBoundary}\n`,
        `Content-Type: ${MimeTypes.JSON_UTF8}\n\n`,
        `${requestBody}\n\n${dashDashBoundary}\n`
      ];
      
      if (this.__isBase64) {
        body.push("Content-Transfer-Encoding: base64\n");
      }
      
      body.push(`Content-Type: ${this.__dataType}\n\n`);
      
      body = new ArrayStringifier()
        .setArray(body)
        .setSeparator("")
        .process();
      
      if (dataIsString) {
        body += `${this.__data}${ending}`;
      } else {
        body = new Uint8Array(StaticUtils.encodedUtf8ToByteArray(utf8.encode(body))
          .concat(this.__data)
          .concat(StaticUtils.encodedUtf8ToByteArray(utf8.encode(ending)))
        );
      }
      
      result = this.__fetcher
        .appendHeader("Content-Length", body.length)
        .appendHeader("Content-Type", `multipart/related; boundary=${this.__fetcher.gDriveApi.multipartBoundary}`)
        .setBody(body)
        .fetch();
    } else if (isResumable) {
      throw new Error("'resumable' isn't implemented yet");
    } else {
      throw new Error(`Invalid upload type: '${this.__queryParameters.uploadType}'`);
    }
    
    return result;
  }
  
  setData(data, dataType) {
    this.__data = data;
    this.__dataType = dataType;
    
    return this;
  }
  
  setIdOfFileToUpdate(fileId) {
    this.__fileId = fileId;
    
    return this;
  }
  
  setIsBase64(isBase64) {
    this.__isBase64 = isBase64;
    
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
