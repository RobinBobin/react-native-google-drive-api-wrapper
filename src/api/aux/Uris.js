import { ArrayStringifier } from "simple-common-utils";
import { stringifyQueryParameters } from "./utils";

export default class Uris {
  static about(queryParameters) {
    return Uris.__makeUri("about", null, null, null, queryParameters);
  }
  
  static files(fileId, method, preDrivePath, queryParameters) {
    return Uris.__makeUri("files", fileId, method, preDrivePath, queryParameters);
  }
  
  static permissions(fileId, permissionId, queryParameters) {
    const path = ["permissions"];
    
    if (permissionId) {
      path.push(permissionId);
    }
    
    return Uris.__makeUri("files", fileId, path.join("/"), null, queryParameters);
  }
  
  static __makeUri(api, fileId = null, path = null, preDrivePath = null, queryParameters) {
    const uri = ["https://www.googleapis.com"];
    
    if (Array.isArray(preDrivePath)) {
      uri.push(...preDrivePath);
    } else if (preDrivePath !== null) {
      uri.push(preDrivePath);
    }
    
    uri.push("drive/v3");
    uri.push(api);
    
    [fileId, path].forEach(element => {
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
