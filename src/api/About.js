import GDriveApi from "./GDriveApi";
import Uris from "./aux/Uris";

export default class About extends GDriveApi {
  get(queryParametersOrFields) {
    const queryParameters = queryParametersOrFields.constructor === Object ? queryParametersOrFields : {fields: queryParametersOrFields};
    
    return this.fetch(Uris.about(queryParameters), "json");
  }
};
