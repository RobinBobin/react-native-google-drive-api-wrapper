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


/*
#### <a name="gdriveapiwPermissions">[Permissions<i class="icon-up"></i>](#cgdriveapiwPermissions)</a>

 - [create()](#gdriveapiwPermissions)
	
	[Creates](https://developers.google.com/drive/v3/reference/permissions/create) a permission for the specified file returning the result of fetch().
	
        GDrive.permissions.create(
            fileId, {
                emailAddress: 'example@gmail.com',
                role: "reader",
                type: "anyone"
            }, {
                emailMessage: `I shared a file with you.`,
            });
	    
 - [delete()](#gdriveapiwPermissions)
	
	[Delete](https://developers.google.com/drive/api/v3/reference/permissions/delete) a permission returning the result of fetch().
	
        GDrive.permissions.delete("fileId", "permissionId");
*/