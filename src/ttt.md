1. createIfNotExists - result type
1. Create chunks in multiples of 256 KB (256 x 1024 bytes) in size
1.  `execute()` sends the initial chunk.
1. It looks like `shouldUseMultipleRequests` is redundant.
1. ResumableUploader.ts - line 114 - what if [] / string is empty?
1. `uploadChunk()` - `setContentLength()`- upload much more - consider this case.
1.  `Uploader.execute()` returns `FetchResultType` - nope.
1.  `setContentLength()` - throw if already sent.




CreateIfNotExistsResultType
HttpError
ListQueryBuilder
MimeTypes
RequestUploadStatusResultType
UnexpectedFileCountError
UploadChunkResultType

ResumableUploader
Uploader



#### <a name="create_if_not_exists_result_type"></a>CreateIfNotExistsResultType

#### <a name="data_type"></a>DataType

Uint8Array | number[] | string



1. <a name="c_create_if_not_exists_result_type"></a>[CreateIfNotExistsResultType](#create_if_not_exists_result_type)
1. <a name="c_http_error"></a>[HttpError](#http_error)
1. <a name="c_list_query_builder"></a>[ListQueryBuilder](#list_query_builder)
5. <a name="c_mime_types"></a>[MimeTypes](#mime_types)
7. <a name="c_request_upload_status_result_type"></a>[RequestUploadStatusResultType](#request_upload_status_result_type)
10. <a name="c_unexpected_file_count_error"></a>[UnexpectedFileCountError](#unexpected_file_count_error)
11. <a name="c_upload_chunk_result_type"></a>[UploadChunkResultType](#upload_chunk_result_type)






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

