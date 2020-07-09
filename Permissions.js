import GDrive from "./GDrive";
import {
   StaticUtils,
   ArrayStringifier
} from "simple-common-utils";

const permissions = "/permissions";

function _stringifyQueryParams(queryParams,
   prefix = "?", separator = "&", quoteIfString)
{
   const array = [];
   
   Object.keys(queryParams).forEach(key => array.push(
      `${key}=${StaticUtils.safeQuoteIfString(queryParams[key], quoteIfString)}`));
   
   return new ArrayStringifier(array)
      .setPrefix(prefix)
      .setSeparator(separator)
      .process();
}

export default class Permissions {
   create(fileId, params, queryParams) {
      const body = JSON.stringify(params);
      
      let finalQueryParams = '';
      if (queryParams) {
         finalQueryParams = _stringifyQueryParams(queryParams);
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
