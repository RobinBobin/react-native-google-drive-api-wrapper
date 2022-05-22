import {
  ArrayStringifier,
  StaticUtils
} from "simple-common-utils";
import utf8 from "utf8";
import Uris from "../Uris";
import FilesApi from "../../files/FilesApi";
import Fetcher, { BodyType } from "../Fetcher";
import MimeTypes from "../../../MimeTypes";

type FetchFunction = () => Promise <any>
type DataType = number[] | string;
type UploadType = "media" | "multipart" | "resumable";

export default class Uploader {
  private static readonly __fetchFunctions = {
    "media": "__fetchMediaOrMetadataOnly",
    "multipart": "__fetchMultipart",
    "resumable": "__fetchResumable"
  } as const

  private __data?: DataType;
  private __dataType?: string;
  private __fetcher: Fetcher <FilesApi>;
  private __idOfFileToUpdate?: string;
  private __isBase64?: boolean;
  private __queryParameters: {uploadType: UploadType | undefined};
  private __requestBody?: string | object;
  
  constructor(fetcher: Fetcher <FilesApi>, uploadType?: UploadType) {
    this.__fetcher = fetcher;
    this.__queryParameters = {uploadType};
  }
  
  execute() {
    const isMetadataOnly = !this.__queryParameters.uploadType;

    this.__requestBody = JSON.stringify(this.__requestBody ?? {});
    
    this.__fetcher
      .setMethod(this.__idOfFileToUpdate ? "PATCH" : "POST")
      .setResource(Uris.files({
        fileId: this.__idOfFileToUpdate,
        preDrivePath: isMetadataOnly ? undefined : "upload",
        queryParameters: this.__queryParameters
      }));
    
    const fetchFunctionName = Uploader.__fetchFunctions[this.__queryParameters.uploadType ?? "media"]

    if (!fetchFunctionName) {
      throw new Error(`Invalid upload type: '${this.__queryParameters.uploadType}'`);
    }

    return (this[fetchFunctionName] as FetchFunction)()
  }
  
  setData(data: DataType, dataType: string) {
    this.__data = data;
    this.__dataType = dataType;
    
    return this;
  }
  
  setIdOfFileToUpdate(fileId?: string) {
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

  __fetchMediaOrMetadataOnly() {
    const body =
      typeof this.__data === "string" ? this.__data
      : !this.__data ? this.__requestBody as string
      : new Uint8Array(this.__data)
    
    return this.__fetcher
      .setBody(body, this.__dataType ?? MimeTypes.JSON)
      .setResponseType("json")
      .fetch();
  }

  __fetchMultipart() {
    const dashDashBoundary = `--${this.__fetcher.gDriveApi.multipartBoundary}`;
    const ending = `\n${dashDashBoundary}--`;
    
    let body: BodyType | string[] = [
      `\n${dashDashBoundary}\n`,
      `Content-Type: ${MimeTypes.JSON_UTF8}\n\n`,
      `${this.__requestBody}\n\n${dashDashBoundary}\n`
    ];
    
    if (this.__isBase64) {
      body.push("Content-Transfer-Encoding: base64\n");
    }
    
    body.push(`Content-Type: ${this.__dataType}\n\n`);
    
    body = new ArrayStringifier()
      .setArray(body)
      .setSeparator("")
      .process();
    
    if (typeof this.__data === "string") {
      body += `${this.__data}${ending}`;
    } else {
      body = new Uint8Array(StaticUtils.encodedUtf8ToByteArray(utf8.encode(body))
        .concat(this.__data)
        .concat(StaticUtils.encodedUtf8ToByteArray(utf8.encode(ending)))
      );
    }
    
    return this.__fetcher
      .appendHeader("Content-Length", body.length)
      .appendHeader("Content-Type", `multipart/related; boundary=${this.__fetcher.gDriveApi.multipartBoundary}`)
      .setBody(body as BodyType)
      .setResponseType("json")
      .fetch();
  }

  async __fetchResumable() {
    const response = this.__fetcher.fetch()
  }
};
