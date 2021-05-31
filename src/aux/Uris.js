import { ArrayStringifier } from "simple-common-utils";
import { stringifyQueryParameters } from "./utils";

export default class Uris {
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
