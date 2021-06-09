import GDriveApi from "./GDriveApi";
import Uris from "./aux/Uris";

const permissions = "/permissions";

export default class Permissions {
   create(fileId, params, queryParams) {
      const body = JSON.stringify(params);

      queryParams = queryParams ? GDrive._stringifyQueryParams(queryParams) : "";

      return fetch(`${GDrive._urlFiles}/${fileId}${permissions}${queryParams}`, {
         method: "POST",
         headers: GDrive._createHeaders(
            GDrive._contentTypeJson,
            body.length
         ),
         body
      });
   }
   
   delete(fileId, permissionId) {
      return fetch(`${GDrive._urlFiles}/${fileId}${permissions}/${permissionId}`, {
         method: `DELETE`,
         headers: GDrive._createHeaders()
      });
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