This wrapper facilitates the use of the [google drive api](https://developers.google.com/drive/v3/reference/).

It doesn't provide any authorization mechanism, so another package has to be used. I use [@react-native-google-signin/google-signin](https://www.npmjs.com/package/@react-native-google-signin/google-signin) (thanks for the great work, [vonovak](https://www.npmjs.com/~vonovak)!).

# Table of contents

1. <a name="c_installation"></a>[Installation](#installation)
1. <a name="c_usage"></a>[Usage](#usage)
    1. <a name="c_usage_gdrive_gdriveapi"></a>[GDrive / GDriveApi](#usage_gdrive_gdriveapi)
    1. <a name="c_usage_uploaders"></a>[Uploaders](#usage_uploaders)
1. <a name="c_changes"></a>[Changes](#changes)

# <a name="installation"></a>[Installation](#c_installation)

    npm i --save @robinbobin/react-native-google-drive-api-wrapper

# <a name="usage"></a>[Usage](#c_usage)

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

## <a name="usage_gdrive_gdriveapi"></a>[GDrive / GDriveApi](#c_usage_gdrive_gdriveapi)

<hr>

Common notes:

- `queryParameters` and `requestBody` are described in the official documentation of the corresponding methods.

<hr>

1. <a name="c_about"></a>[About](#about)
2. <a name="c_files"></a>[Files](#filesfiles)
3. <a name="c_gdrive"></a>[GDrive](#gdrive)
4. <a name="c_gdriveapi"></a>[GDriveApi](#gdriveapi)
5. <a name="c_permissions"></a>[Permissions](#permissions)

### <a name="about"></a>[About](#c_about)

Extending [GDriveApi](#gdriveapi), this class gives [information](https://developers.google.com/drive/api/v3/reference/about) about the user, the user's Drive, and system capabilities.

Name|Type|Description
-|-|-
`get(queryParametersOrFields)`|Method, returns `Promise<`[About resource](https://developers.google.com/drive/api/v3/reference/about#resource)`>`|[Gets](https://developers.google.com/drive/api/v3/reference/about/get) information about the user, the user's Drive, and system capabilities.<br><br>`queryParametersOrFields` can be an object containing the query parameters or a string, containing a [`fields`](https://developers.google.com/drive/api/v3/reference/about/get#parameters) value.

### <a name="filesfiles"></a>[Files](#c_files)

Extending [GDriveApi](#gdriveapi), this class is used to manage [files](https://developers.google.com/drive/api/v3/reference/files) in a google drive.

Notes:
- The parameter `range` for the methods that accept it is specified as [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) with one exception:
**\<unit\>** is always bytes and mustn't be set. E.g.:

        await gdrive.files.getBinary(fileId, null, "1-1");

    will return the byte at index one.

Name|Type|Description
-|-|-
`copy(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  queryParameters?: object,`<br>&nbsp;`  requestBody: object = {}`<br>`)`|Method, returns `Promise<`[File resource](https://developers.google.com/drive/api/v3/reference/files#resource)`>`|Creates a [copy](#https://developers.google.com/drive/api/v3/reference/files/copy) of a file.
`createIfNotExists(`<br>&nbsp;`  queryParameters: object,`<br>&nbsp;`  uploader:`[` Uploader`](#uploader)<br>`)`|Method, returns `Promise<`[CreateIfNotExistsResultType](#create_if_not_exists_result_type)`>`|Invokes `uploader.execute()`, if the file described with `queryParameters` doesn't exist. Throws [`UnexpectedFileCountError`](#unexpected_file_count_error) if there are 2 or more files matching `queryParameters`.
`delete(fileId: string)`|Method, returns `Promise<void>`|[Deletes](https://developers.google.com/drive/api/v3/reference/files/delete) a file.
`emptyTrash()`|Method, returns `Promise<void>`|Permanently [deletes](https://developers.google.com/drive/api/v3/reference/files/emptyTrash) all of the user's trashed files.
`export(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  queryParameters: object`<br>`)`|Method, returns `Promise<`[File resource](https://developers.google.com/drive/api/v3/reference/files#resource)`>`|[Exports](https://developers.google.com/drive/api/v3/reference/files/export) a Google Doc to the requested MIME type.
`generateIds(queryParameters?: object)`|Method, returns `Promise<`[`object`](https://developers.google.com/drive/api/v3/reference/files/generateIds#response)`>`|[Generates](https://developers.google.com/drive/api/v3/reference/files/generateIds) file IDs. [This info](https://developers.google.com/drive/api/guides/manage-uploads#use_a_pre-generated_id_to_upload_files) might seem interesting.
`get(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  queryParameters?: object,`<br>&nbsp;`  range?: string`<br>`)`|Method, returns `Promise<`[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)`>`|[Gets](https://developers.google.com/drive/api/v3/reference/files/get) the file's metadata or content.
`getBinary(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  queryParameters?: object,`<br>&nbsp;`  range?: string`<br>`)`|Method, returns `Promise<`[`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)`>`|Gets the content of a binary file.
`getContent(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  queryParameters?: object,`<br>&nbsp;`  range?: string`<br>`)`|Method, returns `Promise<`[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)`>`|Gets the content of **any** file.
`getJson(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  queryParameters?: object`<br>`)`|Method, returns `Promise<object>`|Gets the content of a json text file.
`getMetadata(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  queryParameters?: object`<br>`)`|Method, returns `Promise<`[File resource](https://developers.google.com/drive/api/v3/reference/files#resource)`>` |Gets a file's metadata.
`getText(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  queryParameters?: object,`<br>&nbsp;`  range?: string`<br>`)`|Method, returns `Promise<string>`|Gets the content of a text file.
<a name="filesfiles_list"></a>`list(queryParameters?: object)`|Method, returns `Promise<`[`object`](https://developers.google.com/drive/api/v3/reference/files/list#response)`>`|[Lists](https://developers.google.com/drive/api/v3/reference/files/list) files.<br><br>`queryParameters.q` can be a [query string](https://developers.google.com/drive/api/guides/search-files) or a [`ListQueryBuilder`](#list_query_builder) instance.
`multipartBoundary`|Property, read/write<br>string|The boundary string to be used for [multipart uploads](#filesfiles_new_multipart_uploader). The default value is `foo_bar_baz`.
`newMediaUploader()`|Method, returns [`MediaUploader`](#media_uploader)|Creates a class instance to handle a `media` upload.
`newMetadataOnlyUploader()`|Method, returns [`MetadataOnlyUploader`](#metadata_only_uploader)|Creates a class instance to handle a `metadata-only` upload.
<a name="filesfiles_new_multipart_uploader"></a>`newMultipartUploader()`|Method, returns [`MultipartUploader`](#multipart_uploader)|Creates a class instance to handle a `multipart` upload.
<a name="filesfiles_newResumableUploader"></a>`newResumableUploader()`|Method, returns [`ResumableUploader`](#resumable_uploader)|Creates a class instance to handle a `resumable` upload.

### <a name="gdrive"></a>[GDrive](#c_gdrive)

A `GDrive` instance stores your google sign-in token and the instances of the [`GDriveApi`](gdriveapi) descendants.

Name|Type|Description
-|-|-
`about`|Property, read/write<br>[`About`](#about) instance|The instance to get [this](https://developers.google.com/drive/api/v3/reference/about) information.
<a name="gdrive_access_token"></a>`accessToken`|Property, read/write<br>access token|Manages [`accessToken`](#gdriveapi_access_token) of all the [`GDriveApi`](#gdriveapi) instances stored in this class instance.
`files`|Property, read/write<br>[`Files`](#filesfiles) instance|The instance to manage [files](https://developers.google.com/drive/api/v3/reference/files) in a google drive.
<a name="gdrive_fetch_timeout"></a>`fetchTimeout`|Property, read/write<br>number|Manages [`fetchTimeout`](#gdriveapi_fetch_timeout) of all the [`GDriveApi`](#gdriveapi) instances stored in this class instance.
`permissions`|Property, read/write<br>[`Permissions`](#permissions) instance|The instance to manage file [permissions](https://developers.google.com/drive/api/v3/reference/permissions).

### <a name="gdriveapi"></a>[GDriveApi](#c_gdriveapi)

The base class for the classes that wrap individual parts of the google drive api.

Name|Type|Description
-|-|-
<a name="gdriveapi_access_token"></a>`accessToken`|Property, read/write<br>access token|The access token to be used in subsequent calls to the api. Get the token from a package you choose to use.
<a name="gdriveapi_fetch_timeout"></a>`fetchTimeout`|Property, read/write<br>number|Timeout in ms for [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) invocations. The default value is `1500`. If the value is negative, `fetch()` will wait infinitely.

### <a name="permissions"></a>[Permissions](#c_permissions)

This class handles file [permissions](https://developers.google.com/drive/api/v3/reference/permissions).

Name|Type|Description
-|-|-
`create(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  requestBody: object,`<br>&nbsp;`  queryParameters?: object`<br>`)`|Method, returns `Promise<`[Permissions resource](https://developers.google.com/drive/api/v3/reference/permissions#resource)`>`|[Creates](https://developers.google.com/drive/api/v3/reference/permissions/create) a permission.
`delete(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  permissionId: string,`<br>&nbsp;`  queryParameters?: object`<br>`)`|Method, returns `Promise<void>`|[Deletes](https://developers.google.com/drive/api/v3/reference/permissions/delete) a permission.

<br>

## <a name="usage_uploaders"></a>[Uploaders](#c_usage_uploaders)

1. <a name="c_resumable_uploader"></a>[ResumableUploader](#resumable_uploader)
1. <a name="c_uploader"></a>[Uploader](#uploader)

### <a name="resumable_uploader"></a>[ResumableUploader](#c_resumable_uploader)

An [Uploader](#uploader) descendant, this class handles resumable uploads.

Name|Type|Description
-|-|-
<a name="resumable_uploader_request_upload_status"></a>`requestUploadStatus()`|Method, returns `Promise<`[`RequestUploadStatusResultType`](#request_upload_status_result_type)`>`|Returns the current upload status.
setContentLength(contentLength: number)|Method|Optional. Sets the content length. **Can't be invoked after sending the initial upload request.**
setDataType(dataType: string)|Method|Sets the data type when using [multiple requests](#resumable_uploader_should_use_multiple_requests).
<a name="resumable_uploader_should_use_multiple_requests"></a>setShouldUseMultipleRequests(shouldUseMultipleRequests: boolean)|Method|Specifies whether multiple requests will be used to upload the data.
transferredByteCount|Read property (Number)|The current transferred byte count.
<a name="resumable_uploader_upload_chunk"></a>uploadChunk(chunk: [DataType](#data_type))|Method|Uploads a chunk of data, returning [IUploadChunkResult](#i_upload_chunk_result), wrapped in a `Promise`.

### <a name="uploader"></a>[Uploader](#c_uploader)

Descendants of this class handle [create](https://developers.google.com/drive/api/v3/reference/files/create) and [update](https://developers.google.com/drive/api/v3/reference/files/update) requests.

Name|Type|Description
-|-|-
`execute()`|Method, returns `Promise<`[File resource](https://developers.google.com/drive/api/v3/reference/files#resource)`>`|Executes the request.
`setData(`<br>&nbsp;`  data:`[` Data`](#data)`,`<br>&nbsp;`  mimeType: string`<br>`)`|Method, returns `this`|Sets the data and its MIME type.
`setIdOfFileToUpdate(`<br>&nbsp;`  fileId: string`<br>`)`|Method, returns `this`|If this method is invoked and `fileId` is a string, the request becomes an update request. Otherwise it's a creation request.
setQueryParameters(queryParameters)|Sets the query parameters.
setRequestBody(requestBody)|Sets the request body.

<br>
<br>

> Written with [StackEdit](https://stackedit.io/).
