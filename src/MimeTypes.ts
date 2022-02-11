export default class MimeTypes {
  static BINARY     = "application/octet-stream";
  static CSV        = "text/csv";
  static FOLDER     = "application/vnd.google-apps.folder";
  static JSON       = "application/json";
  static JSON_UTF8  = "; charset=UTF-8";
  static PDF        = "application/pdf";
  static TEXT       = "text/plain";
};

MimeTypes.JSON_UTF8 = `${MimeTypes.JSON}${MimeTypes.JSON_UTF8}`;
