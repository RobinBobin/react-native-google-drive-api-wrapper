import {
  ArrayStringifier,
  StaticUtils
} from "simple-common-utils";
import utf8 from "utf8";
import Uris from "./Uris";
import FilesApi from "../files/FilesApi";
import Fetcher, { BodyType } from "../aux/Fetcher";
import MimeTypes from "../../MimeTypes";

type DataType = number[] | string;
type UploadType = UploadTypeImplemented | "resumable" | undefined;
type UploadTypeImplemented = "media" | "multipart"

export default class Uploader {
  private __data?: DataType;
  private __dataType?: string;
  private __fetcher: Fetcher <FilesApi>;
  private __idOfFileToUpdate?: string;
  private __isBase64?: boolean;
  private __queryParameters: {uploadType: UploadType};
  private __requestBody?: object;
  
  constructor(fetcher: Fetcher <FilesApi>, uploadType?: UploadTypeImplemented) {
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
    
    const dataIsString = typeof this.__data === "string";
    const isResumable = this.__queryParameters.uploadType === "resumable";
    const preDrivePath = this.__queryParameters.uploadType ? "upload" : undefined;
    const requestBody = JSON.stringify(this.__requestBody ?? {});
    
    this.__fetcher
      .setMethod(this.__idOfFileToUpdate ? "PATCH" : "POST")
      .setResource(Uris.files({
        fileId: this.__idOfFileToUpdate,
        preDrivePath,
        queryParameters: this.__queryParameters
      }));
    
    if (!isResumable) {
      this.__fetcher.setResponseType("json");
    }
    
    let result;
    
    if (this.__queryParameters.uploadType === "media" || !preDrivePath) {
      result = this.__fetcher
        .setBody(
          dataIsString ? this.__data as string: preDrivePath ? new Uint8Array(this.__data as number[]) : requestBody,
          this.__dataType ?? MimeTypes.JSON)
        .fetch();
    } else if (this.__queryParameters.uploadType === "multipart") {
      const dashDashBoundary = `--${this.__fetcher.gDriveApi.multipartBoundary}`;
      const ending = `\n${dashDashBoundary}--`;
      
      let body: BodyType | string[] = [
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
        .setBody(body as BodyType)
        .fetch();
    } else if (isResumable) {
      throw new Error("'resumable' isn't implemented yet");
    } else {
      throw new Error(`Invalid upload type: '${this.__queryParameters.uploadType}'`);
    }
    
    return result;
  }
  
  setData(data: DataType, dataType: string) {
    this.__data = data;
    this.__dataType = dataType;
    
    return this;
  }
  
  setIdOfFileToUpdate(fileId: string) {
    this.__idOfFileToUpdate = fileId;
    
    return this;
  }
  
  setIsBase64(isBase64: boolean) {
    this.__isBase64 = isBase64;
    
    return this;
  }
  
  setQueryParameters(queryParameters: object) {
    this.__queryParameters = {
      ...queryParameters,
      uploadType: this.__queryParameters.uploadType
    };
    
    return this;
  }
  
  setRequestBody(requestBody: object) {
    this.__requestBody = requestBody;
    
    return this;
  }
};
