This wrapper facilitates the use of the [google drive api](https://developers.google.com/drive/v3/reference/).

It doesn't provide any authorization mechanism, so another package has to be used. I use [@react-native-google-signin/google-signin](https://www.npmjs.com/package/@react-native-google-signin/google-signin) (thanks for the great work, [vonovak](https://www.npmjs.com/~vonovak)!).

1. <a name="c_installation"></a>[Installation](#installation)
2. <a name="c_usage"></a>[Usage](#usage)
3. <a name="c_version_history"></a>[Version history](#version_history)

### <a name="installation"></a>[Installation](#c_installation)

    npm i --save @robinbobin/react-native-google-drive-api-wrapper

### <a name="usage"></a>[Usage](#c_usage)

Example (list files, create a binary file and read it):

    import { GoogleSignin } from "@react-native-google-signin/google-signin";
    import {
      GDrive,
      MimeTypes
    } from "@robinbobin/react-native-google-drive-api-wrapper";
    
    // = Somewhere in your code = //
    GoogleSignin.configure(...);
    await GoogleSignin.signIn();
    
    const gdrive = new GDrive();
    gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
    
    console.log(await gdrive.files.list());
    
    const id = (await gdrive.files.newMultipartUploader()
      .setData([1, 2, 3, 4, 5], MimeTypes.BINARY)
      .setRequestBody({
        name: "multipart_bin"
      })
      .execute()
    ).id;
    
    console.log(await gdrive.files.getBinary(id));

<br>

1. <a name="c_about"></a>[About](#about)
2. <a name="c_files"></a>[Files](#files)
3. <a name="c_gdrive"></a>[GDrive](#gdrive)
4. <a name="c_gdriveapi"></a>[GDriveApi](#gdriveapi)
5. <a name="c_http_error"></a>[HttpError](#http_error)
6. <a name="c_mime_types"></a>[MimeTypes](#mime_types)
7. <a name="c_uploader"></a>[Uploader](#uploader)

#### <a name="about"></a>[About](#c_about)

Extending [GDriveApi](#gdriveapi), this class gives access to [various information](https://developers.google.com/drive/api/v3/reference/about).

Name|Description
-|-
get(queryParametersOrFields)|[Gets](https://developers.google.com/drive/api/v3/reference/about) various information, returning an [About resource](https://developers.google.com/drive/api/v3/reference/about#resource) if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`. `queryParametersOrFields` can be an object containing the query parameters or a string, containing a [`fields`](https://developers.google.com/drive/api/v3/reference/about/get#parameters) value.

#### <a name="files"></a>[Files](#c_files)

Extending [GDriveApi](#gdriveapi), this class is used to manage [files](#https://developers.google.com/drive/api/v3/reference/files) in a google drive. The parameter `range` for the methods that accept it is specified as [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) with one exception:
**\<unit\>** is always bytes and mustn't be set. E.g.:

    await gdrive.files.getBinary(fileId, null, "1-1");

will return the byte at index one.

Name|Type|Description
-|-|-
copy(fileId, queryParameters, requestBody = {})|Method|Creates a [copy](#https://developers.google.com/drive/api/v3/reference/files/copy) of a file. Returns a [Files resource](https://developers.google.com/drive/api/v3/reference/files#resource) if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
delete(fileId)|Method|[Deletes](https://developers.google.com/drive/api/v3/reference/files/delete) a file. Returns an empty string if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
emptyTrash()|Method|Permanently [deletes](https://developers.google.com/drive/api/v3/reference/files/emptyTrash) all of the user's trashed files. Returns an empty string if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
export(fileId, queryParameters)|Method|[Exports](https://developers.google.com/drive/api/v3/reference/files/export) a Google Doc to the requested MIME type. Returns a [Files resource](https://developers.google.com/drive/api/v3/reference/files#resource) if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
generateIds(queryParameters)|Method|[Generates](https://developers.google.com/drive/api/v3/reference/files/generateIds) file IDs. Returns an `Object` if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
get(fileId, queryParameters, range)|Method|[Gets](https://developers.google.com/drive/api/v3/reference/files/get) a file's metadata or content by ID. Returns the result of [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) if the call succeeds, [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is ignored.
getBinary(fileId, queryParameters, range)|Method|Gets the content of a binary file. Returns `Uint8Array` if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
getContent(fileId, queryParameters, range)|Method|Gets the content of **any** file. Returns the result of [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) if the call succeeds, [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is ignored.
getJson(fileId, queryParameters)|Method|Gets the content of a json text file. Returns an `Object` if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
getMetadata(fileId, queryParameters = {})|Method|Gets a file's metadata. Returns a [Files resource](https://developers.google.com/drive/api/v3/reference/files) if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
getText(fileId, queryParameters, range)|Method|Gets the content of a text file. Returns a string if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
list(queryParameters)|Method|[Lists](https://developers.google.com/drive/api/v3/reference/files/list) files. Returns an `Object` if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
multipartBoundary|String (read/write property)|The boundary string to be used for multipart uploads. The default value is `"foo_bar_baz"`.
newMediaUploader()|Method|Creates an [Uploader](#uploader) instance with `uploadType` of `media`.
newMetadataOnlyUploader()|Method|Creates a metadata-only [Uploader](#uploader) instance.
newMultipartUploader()|Method|Creates an [Uploader](#uploader) instance with `uploadType` of `multipart`.

#### <a name="gdrive"></a>[GDrive](#c_gdrive)

A `GDrive` instance stores your google sign-in token and the class instances you create to utilize the google drive api.

Name|Type|Description
-|-|-
about|[`About`](#about) instance|The instance to get [various information](https://developers.google.com/drive/api/v3/reference/about).
accessToken|access token|The access token to be used in subsequent calls to the api. Get the token from a package you choose to use.
files|[`Files`](#files) instance|The instance to manage [files](#https://developers.google.com/drive/api/v3/reference/files) in a google drive.

#### <a name="gdriveapi"></a>[GDriveApi](#c_gdriveapi)

The base class for the classes that wrap individual parts of the google drive api.

Name|Type|Description
-|-|-
<a name="gdriveapi_fetch_coerces_types"></a>fetchCoercesTypes|Boolean (read/write property)|If true, the data returned from a successful api call is converted to the json, text or byte (`Uint8Array`) type. If `false`, no conversion is performed and the result of [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is returned as is. The type, the data is coerced to, is specified in the documentation of each method, that utilizes this property. The default value is `true`.
<a name="gdriveapi_fetch_rejects_on_http_errors"></a>fetchRejectsOnHttpErrors|Boolean (read/write property)|If true, unsuccessful api calls throw an instance of [`HttpError`](#http_error). If `false`, the result of [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is returned as is. The default value is `true`.

#### <a name="http_error"></a>[HttpError](#c_http_error)

An instance of this class is thrown when an api call fails, if [fetchRejectsOnHttpErrors](#gdriveapi_fetch_rejects_on_http_errors) is `true` for that api. All the properties are read-only.

Name|Type|Description
-|-|-
json|Object|An object containing the error. Can be `undefined`.
response|Object|The result of [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
text|String|The error description obtained from the response.

#### <a name="mime_types"></a>[MimeTypes](#c_mime_types)

Commonly used MIME types. The class contains only static fields.

Name|Type
-|-
BINARY|`application/octet-stream`
CSV|`text/csv`
FOLDER|`application/vnd.google-apps.folder`
JSON|`application/json`
JSON_UTF8|`application/json; charset=UTF-8`
PDF|`application/pdf`
TEXT|`text/plain`

#### <a name="uploader"></a>[Uploader](#c_uploader)

This class handles the [create](https://developers.google.com/drive/api/v3/reference/files/create) and [update](https://developers.google.com/drive/api/v3/reference/files/update) requests. Currently only `media`, `multipart` and metadata-only requests are supported.

Name|Description
-|-
execute()|Executes the request, returning an `Object` if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
setData(data, dataType)|Sets the data and its MIME type.
setIdOfFileToUpdate(fileId)|If this method is invoked, the request becomes an update request. Otherwise it's a creation request.
setIsBase64(isBase64)|If it's a `multipart` request and the data supplied is Base64, this method can be invoked to add the header `Content-Transfer-Encoding: base64` which is recognized by Google Drive.
setQueryParameters(queryParameters)|Sets the query parameters.
setRequestBody(requestBody)|Sets the request body.

### <a name="version_history"></a>[Version history](#c_version_history)

Version number|Changes
-|-
v0.3.0|Initial documented release.

<br>
<br>

> Written with [StackEdit](https://stackedit.io/).
