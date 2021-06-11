import GDriveApi from "./GDriveApi";
import Uris from "./aux/Uris";
import MimeTypes from "../MimeTypes";

export default class Permissions extends GDriveApi {
  create(fileId, queryParameters, requestBody) {
    return this.createFetcher()
      .setBody(JSON.stringify(requestBody), MimeTypes.JSON)
      .setMethod("POST")
      .fetch(Uris.permissions(fileId, null, queryParameters), "json");
  }
  
  delete(fileId, permissionId, queryParameters) {
    return this.createFetcher()
      .setMethod("DELETE")
      .fetch(Uris.permissions(fileId, permissionId, queryParameters), "text");
  }
};
