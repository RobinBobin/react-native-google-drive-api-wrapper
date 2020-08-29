import GDrive from "./GDrive";

export default class About {
    get(queryParams) {
        return fetch(`${GDrive._urlAbout}${GDrive._stringifyQueryParams(queryParams)}`, {
            headers: GDrive._createHeaders()
        });
    }
}
