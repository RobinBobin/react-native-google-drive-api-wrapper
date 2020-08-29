import GDrive from "./GDrive";

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
}
