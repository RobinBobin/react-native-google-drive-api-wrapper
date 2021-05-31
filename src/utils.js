import { toByteArray } from "base64-js";
import {
  ArrayStringifier,
  StaticUtils
} from "simple-common-utils";

export class ContentType {
  static JSON = "application/json; charset=UTF-8";
};

export class Mimes {
  static FOLDER = "application/vnd.google-apps.folder";
};

export class Uris {
  // static about(path, queryParameters) {
  //   return Uris.__makeUri("drive/v3/about", path, queryParameters);
  // }
  
  static files(fileId, method, preDrivePath, queryParameters) {
    return Uris.__makeUri("files", fileId, method, preDrivePath, queryParameters);
  }
  
  static __makeUri(api, fileId = null, method = null, preDrivePath = null, queryParameters) {
    const uri = ["https://www.googleapis.com"];
    
    if (Array.isArray(preDrivePath)) {
      uri.push(...preDrivePath);
    } else if (preDrivePath !== null) {
      uri.push(preDrivePath);
    }
    
    uri.push("drive/v3");
    uri.push(api);
    
    [fileId, method].forEach(element => {
      if (element !== null) {
        uri.push(element);
      }
    });
    
    return new ArrayStringifier()
      .setArray(uri)
      .setPostfix(stringifyQueryParameters(queryParameters))
      .setSeparator("/")
      .process();
  }
};

export async function blobToByteArray(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onerror = event => reject(reader, event);
    
    reader.onload = () => resolve(toByteArray(reader.result.split("data:application/octet-stream;base64,")[1]));
    
    reader.readAsDataURL(blob);
  });
}

export function stringifyQueryParameters(queryParameters = {}, prefix = "?", separator = "&", quoteIfString) {
  const array = Object.keys(queryParameters).map(key => `${key}=${StaticUtils.safeQuoteIfString(queryParameters[key], quoteIfString)}`);
  
  return new ArrayStringifier(array)
     .setPrefix(prefix)
     .setSeparator(separator)
     .process();
}
