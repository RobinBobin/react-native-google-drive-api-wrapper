import RNFS from "react-native-fs";
import utf8 from "utf8";
import { StaticUtils } from "simple-common-utils";
import GDrive from "./GDrive";

const uploadUrl = "https://www.googleapis.com/upload/drive/v3/files";

export default class Files {
   static mimeFolder = "application/vnd.google-apps.folder";
   
   constructor(params = {}) {
      this.params = params;
      
      [
         [ "boundary", "foo_bar_baz" ]
      ].forEach(nameValue => this.params[nameValue[0]] =
         this.params[nameValue[0]] || nameValue[1]);
   }
   
   createFileMultipart(media, mediaType, metadata, isBase64) {
      const ddb = `--${this.params.boundary}`;
      const ending = `\n${ddb}--`;
      
      let body = `\n${ddb}\n` +
         `Content-Type: ${GDrive._contentTypeJson}\n\n` +
         `${JSON.stringify(metadata)}\n\n${ddb}\n` +
         (isBase64 ? "Content-Transfer-Encoding: base64\n" : '') +
         `Content-Type: ${mediaType}\n\n`;
      
      if (media.constructor == String) {
         body += `${media}${ending}`;
      } else {
         body = new Uint8Array(
            StaticUtils.encodedUtf8ToByteArray(utf8.encode(body))
            .concat(media)
            .concat(StaticUtils.encodedUtf8ToByteArray(utf8.encode(ending))));
      }
      
      return fetch(
         `${uploadUrl}?uploadType=multipart`, {
            method: "POST",
            headers: GDrive._createHeaders(
               `multipart/related; boundary=${this.params.boundary}`,
               body.length
            ),
            body
         });
   }
   
   delete(fileId) {
      return fetch(`${GDrive._urlFiles}/${fileId}`, {
         method: "DELETE",
         headers: GDrive._createHeaders()
      });
   }
   
   async safeCreateFolder(metadata) {
      let id = await this.getId(metadata.name, metadata.parents, Files.mimeFolder);
      
      if (!id) {
         metadata.mimeType = Files.mimeFolder;
         
         const body = JSON.stringify(metadata);
         
         result = await fetch(GDrive._urlFiles, {
            method: "POST",
            headers: GDrive._createHeaders(
               GDrive._contentTypeJson,
               body.length),
            body
         });
         
         if (!result.ok) {
            throw result;
         }
         
         id = (await result.json()).id;
      }
      
      return id;
   }
   
   async getId(name, parents, mimeType, trashed = false) {
      const queryParams = {name, trashed};
      
      if (mimeType) {
         queryParams.mimeType = mimeType;
      }
      
      let result = await this.list({
         q: GDrive._stringifyQueryParams(queryParams, "",
            " and ", true) + ` and '${parents[0]}' in parents`
      });
      
      if (!result.ok) {
         throw result;
      }
      
      const file = (await result.json()).files[0];
      
      return file ? file.id : file;
   }
   
   get(fileId, queryParams) {
      const parameters = GDrive._stringifyQueryParams(queryParams);
      
      return fetch(`${GDrive._urlFiles}/${fileId}${parameters}`, {
         headers: GDrive._createHeaders()
      });
   }
   
   download(fileId, downloadFileOptions, queryParams = {}) {
      queryParams.alt = "media";
      
      const parameters = GDrive._stringifyQueryParams(queryParams);
      
      downloadFileOptions.fromUrl = `${GDrive._urlFiles}/${fileId}${parameters}`;
      
      downloadFileOptions.headers = Object.assign({
         "Authorization": `Bearer ${GDrive.accessToken}`
      }, downloadFileOptions.headers);
      
      return RNFS.downloadFile(downloadFileOptions);
   }
   
   list(queryParams) {
      return fetch(`${GDrive._urlFiles}${GDrive._stringifyQueryParams(queryParams)}`, {
         headers: GDrive._createHeaders()
      });
   }

   update(fileId, queryParams) {
      let resource = queryParams.resource;
      delete queryParams.resource;

      let config = {
            headers: GDrive._createHeaders('application/json'),
            method: 'PATCH'
      };

      if( resource ) {
         config.body = JSON.stringify(resource);
      }
      return fetch(`${GDrive._urlFiles}/${fileId}${GDrive._stringifyQueryParams(queryParams)}`,config);
   }
   
   export(fileId, mimeType) {
      return fetch(`${GDrive._urlFiles}/${fileId}/export?mimeType=${mimeType}`, {
         headers: GDrive._createHeaders()
      });
   }
}
