import { toByteArray } from "base64-js";
import {
  ArrayStringifier,
  StaticUtils
} from "simple-common-utils";

export function blobToByteArray(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onerror = event => reject(reader, event);
    
    reader.onload = () => resolve(toByteArray(reader.result.split("data:application/octet-stream;base64,")[1]));
    
    reader.readAsDataURL(blob);
  });
}

export function stringifyQueryParameters(queryParameters, prefix = "?", separator = "&", quoteIfString) {
  const _queryParameters = queryParameters ?? {};
  
  const array = Object.keys(_queryParameters).map(key => `${key}=${StaticUtils.safeQuoteIfString(_queryParameters[key], quoteIfString)}`);
  
  return new ArrayStringifier(array)
     .setPrefix(prefix)
     .setSeparator(separator)
     .process();
}
