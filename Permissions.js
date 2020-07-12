import GDrive from "./GDrive";

const permissions = "/permissions";

export default class Permissions {
   create(fileId, params, queryParams) {
      const body = JSON.stringify(params);
      
      let finalQueryParams = '';
      if (queryParams) {
         finalQueryParams = GDrive._stringifyQueryParams(queryParams);
      }

      return fetch(`${GDrive._urlFiles}/${fileId}${permissions}${finalQueryParams}`, {
         method: "POST",
         headers: GDrive._createHeaders(
            GDrive._contentTypeJson,
            body.length
         ),
         body
      });
   }
}
