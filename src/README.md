This wrapper facilitates the use of the [google drive api](https://developers.google.com/drive/v3/reference/).

It doesn't provide any authorization mechanism, so another package has to be used. I use [@react-native-google-signin/google-signin](https://www.npmjs.com/package/@react-native-google-signin/google-signin) (thanks for the great work, [vonovak](https://www.npmjs.com/~vonovak)!).

1. <a name="c_installation"></a>[Installation](#installation)
2. <a name="c_usage"></a>[Usage](#usage)
3. <a name="c_version_history"></a>[Version history](#version_history)

### <a name="installation"></a>[Installation](#c_installation)

    npm i --save @robinbobin/react-native-google-drive-api-wrapper

### <a name="usage"></a>[Usage](#c_usage)

If something doesn't work as expected, please do have a look at an example [project](https://github.com/RobinBobin/gdrivetest) before opening an issue.

Quick example:

    // = List files, create a binary file and read it = //
    
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
2. <a name="c_files"></a>[Files](#filesfiles)
3. <a name="c_gdrive"></a>[GDrive](#gdrive)
4. <a name="c_gdriveapi"></a>[GDriveApi](#gdriveapi)
5. <a name="c_http_error"></a>[HttpError](#http_error)
6. <a name="c_list_query_builder"></a>[ListQueryBuilder](#list_query_builder)
7. <a name="c_mime_types"></a>[MimeTypes](#mime_types)
8. <a name="c_permissions"></a>[Permissions](#permissions)
9. <a name="c_resumable_uploader"></a>[ResumableUploader](#resumable_uploader)
10. <a name="c_unexpected_file_count_error"></a>[UnexpectedFileCountError](#unexpected_file_count_error)
11. <a name="c_uploader"></a>[Uploader](#uploader)

#### <a name="about"></a>[About](#c_about)

Extending [GDriveApi](#gdriveapi), this class gives access to [various information](https://developers.google.com/drive/api/v3/reference/about).

Name|Description
-|-
get(queryParametersOrFields)|[Gets](https://developers.google.com/drive/api/v3/reference/about) various information, returning an [About resource](https://developers.google.com/drive/api/v3/reference/about#resource) if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`. `queryParametersOrFields` can be an object containing the query parameters or a string, containing a [`fields`](https://developers.google.com/drive/api/v3/reference/about/get#parameters) value.

#### <a name="data_type"></a>DataType

Uint8Array | number[] | string

#### <a name="filesfiles"></a>[Files](#c_files)

Extending [GDriveApi](#gdriveapi), this class is used to manage [files](https://developers.google.com/drive/api/v3/reference/files) in a google drive. The parameter `range` for the methods that accept it is specified as [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) with one exception:
**\<unit\>** is always bytes and mustn't be set. E.g.:

    await gdrive.files.getBinary(fileId, null, "1-1");

will return the byte at index one.

Name|Type|Description
-|-|-
copy(fileId, queryParameters, requestBody = {})|Method|Creates a [copy](#https://developers.google.com/drive/api/v3/reference/files/copy) of a file. Returns a [Files resource](https://developers.google.com/drive/api/v3/reference/files#resource) if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
createIfNotExists(queryParameters, uploader)|Method|Invokes `uploader.execute()` and returns its result, if the file described with `queryParameters` doesn't exist. Returns the result of `list(queryParameters)` otherwise. Throws [`UnexpectedFileCountError`](#unexpected_file_count_error) if there are 2 or more files matching `queryParameters`.
delete(fileId)|Method|[Deletes](https://developers.google.com/drive/api/v3/reference/files/delete) a file. Returns an empty string if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
emptyTrash()|Method|Permanently [deletes](https://developers.google.com/drive/api/v3/reference/files/emptyTrash) all of the user's trashed files. Returns an empty string if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
export(fileId, queryParameters)|Method|[Exports](https://developers.google.com/drive/api/v3/reference/files/export) a Google Doc to the requested MIME type. Returns a [Files resource](https://developers.google.com/drive/api/v3/reference/files#resource) if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
generateIds(queryParameters)|Method|[Generates](https://developers.google.com/drive/api/v3/reference/files/generateIds) file IDs. [This info](https://developers.google.com/drive/api/guides/manage-uploads#use_a_pre-generated_id_to_upload_files) might seem interesting. Returns an `Object` if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
get(fileId, queryParameters, range)|Method|[Gets](https://developers.google.com/drive/api/v3/reference/files/get) a file's metadata or content by ID. Returns the result of [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) if the call succeeds, [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is ignored.
getBinary(fileId, queryParameters, range)|Method|Gets the content of a binary file. Returns `Uint8Array` if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
getContent(fileId, queryParameters, range)|Method|Gets the content of **any** file. Returns the result of [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) if the call succeeds, [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is ignored.
getJson(fileId, queryParameters)|Method|Gets the content of a json text file. Returns an `Object` if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
getMetadata(fileId, queryParameters = {})|Method|Gets a file's metadata. Returns a [Files resource](https://developers.google.com/drive/api/v3/reference/files) if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
getText(fileId, queryParameters, range)|Method|Gets the content of a text file. Returns a string if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
<a name="filesfiles_list"></a>list(queryParameters)|Method|[Lists](https://developers.google.com/drive/api/v3/reference/files/list) files. Returns an `Object` if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.<br><br>`queryParameters.q` can be a [`ListQueryBuilder`](#list_query_builder) instance.
multipartBoundary|String (read/write property)|The boundary string to be used for multipart uploads. The default value is `"foo_bar_baz"`.
newMediaUploader()|Method|Creates an instance of `MediaUploader`, an [Uploader](#uploader) descending class handling `media` uploads.
newMetadataOnlyUploader()|Method|Creates an instance of `MetadataOnlyUploader`, an [Uploader](#uploader) descending class handling metadata-only uploads.
newMultipartUploader()|Method|Creates an instance of `MultipartUploader`, an [Uploader](#uploader) descending class handling `multipart` uploads.
<a name="filesfiles_newResumableUploader"></a>newResumableUploader()|Method|Creates an instance of [ResumableUploader](#resumable_uploader).

#### <a name="gdrive"></a>[GDrive](#c_gdrive)

A `GDrive` instance stores your google sign-in token and the instances of the [GDriveApi](gdriveapi) descendants.

Name|Type|Description
-|-|-
about|[`About`](#about) instance (read/write property)|The instance to get [various information](https://developers.google.com/drive/api/v3/reference/about).
accessToken|access token (read/write property)|The access token to be used in subsequent calls to the api. Get the token from a package you choose to use.
files|[`Files`](#filesfiles) instance (read/write property)|The instance to manage [files](https://developers.google.com/drive/api/v3/reference/files) in a google drive.
<a name="gdrive_fetch_coerces_types"></a>fetchCoercesTypes|(read/write property)|Manages [`fetchCoercesTypes`](#gdriveapi_fetch_coerces_types) of all the `GDriveApi` instances stored in this class instance.
<a name="gdrive_fetch_rejects_on_http_errors"></a>fetchRejectsOnHttpErrors|(read/write property)|Manages [`fetchRejectsOnHttpErrors`](#gdriveapi_fetch_rejects_on_http_errors) of all the `GDriveApi` instances stored in this class instance.
<a name="gdrive_fetch_timeout"></a>fetchTimeout|(read/write property)|Manages [`fetchTimeout`](#gdriveapi_fetch_timeout) of all the `GDriveApi` instances stored in this class instance.
permissions|[`Permissions`](#permissions) instance|The instance to manage file [permissions](https://developers.google.com/drive/api/v3/reference/permissions).

#### <a name="gdriveapi"></a>[GDriveApi](#c_gdriveapi)

The base class for the classes that wrap individual parts of the google drive api.

Name|Type|Description
-|-|-
<a name="gdriveapi_fetch_coerces_types"></a>fetchCoercesTypes|Boolean (read/write property)|If true, the data returned from a successful api call is converted to the json, text or byte (`Uint8Array`) type. If `false`, no conversion is performed and the result of [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is returned as is. The type, the data is coerced to, is specified in the documentation of each method, that utilizes this property. The default value is `true`.
<a name="gdriveapi_fetch_rejects_on_http_errors"></a>fetchRejectsOnHttpErrors|Boolean (read/write property)|If true, unsuccessful api calls throw an instance of [`HttpError`](#http_error). If `false`, the result of [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is returned as is. The default value is `true`.
<a name="gdriveapi_fetch_timeout"></a>fetchTimeout|Number (read/write property)|Timeout in ms for [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) invocations. The default value is `1500`. If the value is negative, `fetch()` will wait infinitely.

#### <a name="http_error"></a>[HttpError](#c_http_error)

An instance of this class is thrown when an api call fails, if [fetchRejectsOnHttpErrors](#gdriveapi_fetch_rejects_on_http_errors) is `true` for that api. All the properties are read-only.

Name|Type|Description
-|-|-
json|Object|An object containing the error. Can be `undefined`.
response|Object|The result of [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
text|String|The error description obtained from the response.

#### <a name="i_request_upload_status_result"></a>IRequestUploadStatusResult

This interface is used as the return type of [ResumableUploader.requestUploadStatus()](#resumable_uploader_request_upload_status).

Name|Type
-|-
isComplete|Boolean
transferredByteCount|Number

#### <a name="i_upload_chunk_result"></a>IUploadChunkResult

Extending [IRequestUploadStatusResult](#i_request_upload_status_result), describes the result of [uploading a chunk of data](#resumable_uploader_upload_chunk). Its only field, `json`, is optional and will be missing when `isComplete` is `false`.

Name|Type
-|-
json|any

#### <a name="list_query_builder"></a>[ListQueryBuilder](#c_list_query_builder)

A helper for building [`list()`](#filesfiles_list) [queries](https://developers.google.com/drive/api/v3/search-files).

Example:

    // = List files contained in the root folder and named "Untitled" = //
    const folderIdNotItsName = "root";
    
    await gdrive.files.list({
      q: new ListQueryBuilder()
        .e("name", "Untitled")
        .and()
        .in(folderIdNotItsName, "parents")
    });

Name|Description
-|-
and()|`and`s two subqueries.
contains(key, value, quoteValueIfString = true)|key contains value
e(key, value, quoteValueIfString = true)|key = value
g(key, value, quoteValueIfString = true)|key > value
in(value, key, quoteValueIfString = true)|value in key
l(key, value, quoteValueIfString = true)|key < value
operator(left, operator, right, quoteLeftIfString, quoteRightIfString)|A generic method to build all the other key/value relations.
or()|`or`s two subqueries.
pop()|Adds `)`.
push()|Adds `(`.
toString()|Stringifies the query (called internally by [`list()`](#filesfiles_list)).

#### <a name="mime_types"></a>[MimeTypes](#c_mime_types)

Commonly used MIME types.

Name|Type
-|-
BINARY|`application/octet-stream`
CSV|`text/csv`
FOLDER|`application/vnd.google-apps.folder`
JSON|`application/json`
JSON_UTF8|`application/json; charset=UTF-8`
PDF|`application/pdf`
TEXT|`text/plain`

#### <a name="permissions"></a>[Permissions](#c_permissions)

This class handles file [permissions](https://developers.google.com/drive/api/v3/reference/permissions).

Name|Description
-|-
create(fileId, queryParameters, requestBody)|[Creates](https://developers.google.com/drive/api/v3/reference/permissions/create) a permission, returning a [Permissions resource](https://developers.google.com/drive/api/v3/reference/permissions#resource) if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
delete(fileId, permissionId, queryParameters)|[Deletes](https://developers.google.com/drive/api/v3/reference/permissions/delete) a permission, returning an empty string if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.

#### <a name="resumable_uploader"></a>[ResumableUploader](#c_resumable_uploader)

An [Uploader](#uploader) descendant, this class handles resumable uploads.

Name|Type|Description
-|-|-
<a name="resumable_uploader_request_upload_status"></a>requestUploadStatus()|Method|Returns the current [upload status](#i_request_upload_status_result), wrapped in a `Promise`.
setContentLength(contentLength: number)|Method|Optional. Sets the content length. **Can't be invoked after sending the initial upload request.**
setDataType(dataType: string)|Method|Sets the data type when using [multiple requests](#resumable_uploader_should_use_multiple_requests).
<a name="resumable_uploader_should_use_multiple_requests"></a>setShouldUseMultipleRequests(shouldUseMultipleRequests: boolean)|Method|Specifies whether multiple requests will be used to upload the data.
transferredByteCount|Read property (Number)|The current transferred byte count.
<a name="resumable_uploader_upload_chunk"></a>uploadChunk(chunk: [DataType](#data_type))|Method|Uploads a chunk of data, returning [IUploadChunkResult](#i_upload_chunk_result), wrapped in a `Promise`.

#### <a name="unexpected_file_count_error"></a>[UnexpectedFileCountError](#c_unexpected_file_count_error)

An instance of this class is thrown when the real number of files differs from the expected. All the properties are read-only.

Name|Type|Description
-|-|-
expectedCount|Array\|Number|The expected count.
realCount|Number|Real count.

#### <a name="uploader"></a>[Uploader](#c_uploader)

Descendants of this class handle the [create](https://developers.google.com/drive/api/v3/reference/files/create) and [update](https://developers.google.com/drive/api/v3/reference/files/update) requests. All the methods except `execute()` can be chained.

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
v1.2.3|[Resumable uploads](#filesfiles_newResumableUploader) added.
v1.2.0|1. The package is rewritten in TypeScript.<br>2. The following properties are added to [`GDrive`](#gdrive):<br><ul><li>[`fetchCoercesTypes`](#gdrive_fetch_coerces_types)</li><li>[`fetchRejectsOnHttpErrors`](#gdrive_fetch_rejects_on_http_errors)</li><li>[`fetchTimeout`](#gdrive_fetch_timeout)</li></ul>
v1.1.0|[`GDriveApi.fetchTimeout`](#gdriveapi_fetch_timeout) can be set to a negative value to make `fetch()` wait infinitely.
v1.0.1|My example [repo](https://github.com/RobinBobin/gdrivetest) for this package  is referenced in the readme.
v1.0.0|1. [`GDriveApi.fetchTimeout`](#gdriveapi_fetch_timeout) added.<br>2. [`HttpError`](#http_error) and [`UnexpectedFileCountError`](#unexpected_file_count_error): prototype names are specified and error messages are made more concise.
v0.6.0|1. [`UnexpectedFileCountError`](#unexpected_file_count_error).<br>2. `Files.createIfNotExists()` is added.
v0.5.0|[`ListQueryBuilder`](#list_query_builder) added.
v0.4.0|[`Permissions`](#permissions) added.
v0.3.0|Initial documented release.

<br>
<br>

> Written with [StackEdit](https://stackedit.io/).
