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
  static about(path, queryParams) {
    return Uris.__makeUri("drive/v3/about", path, queryParams);
  }
  
  static files(path, queryParams) {
    return Uris.__makeUri("drive/v3/files", path, queryParams);
  }
  
  static __makeUri(uri, path, queryParams) {
    const realPath = new ArrayStringifier()
      .setArray(Array.isArray(path) ? path : path === null ? [] : [path])
      .setPrefix("/")
      .setSeparator("/");
    
    return `https://www.googleapis.com/${uri}${realPath}${stringifyQueryParams(queryParams)}`;
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

export function stringifyQueryParams(queryParams = {}, prefix = "?", separator = "&", quoteIfString) {
  const array = Object.keys(queryParams).map(key => `${key}=${StaticUtils.safeQuoteIfString(queryParams[key], quoteIfString)}`);
  
  return new ArrayStringifier(array)
     .setPrefix(prefix)
     .setSeparator(separator)
     .process();
}
