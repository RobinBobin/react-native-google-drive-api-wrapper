import GDrive from "./GDrive";

const permissions = "/permissions";

export default class Permissions {
   create(fileId, params) {
      console.log('vvvv');
      const body = JSON.stringify(params);
      
      return fetch(`${GDrive._urlFiles}/${fileId}${permissions}`, {
         method: "POST",
         headers: GDrive._createHeaders(
            GDrive._contentTypeJson,
            body.length
         ),
         body
      });
   }
}
