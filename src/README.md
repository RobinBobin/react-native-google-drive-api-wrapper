This wrapper facilitates the use of the [google drive api](https://developers.google.com/drive/v3/reference/).

It doesn't provide any authorization mechanism, so another package has to be used. I use [@react-native-google-signin/google-signin](https://www.npmjs.com/package/@react-native-google-signin/google-signin) (thanks for the great work, [vonovak](https://www.npmjs.com/~vonovak)!).

# Table of contents

1. <a name="c_installation"></a>[Installation](#installation)
2. <a name="c_usage"></a>[Usage](#usage)
    1. <a name="c_usage_gdrive"></a>[GDrive](#usage_gdrive)
    2. <a name="c_usage_uploaders"></a>[Uploaders](#usage_uploaders)
    3. <a name="c_usage_other_entities"></a>[Other entities](#usage_other_entities)

# <a name="installation"></a>[Installation](#c_installation)

    npm i --save @robinbobin/react-native-google-drive-api-wrapper

# <a name="usage"></a>[Usage](#c_usage)

If something doesn't work as expected, please do have a look at an example [project](https://github.com/RobinBobin/gdrivetest) before opening an issue.

Quick example:

    // = List files, create a binary file and read it = //
    
    import { GoogleSignin } from "@react-native-google-signin/google-signin";
    import {
      GDrive,
      MimeType
    } from "@robinbobin/react-native-google-drive-api-wrapper";
    
    // = Somewhere in your code = //
    GoogleSignin.configure(...);
    await GoogleSignin.signIn();
    
    const gdrive = new GDrive();
    gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
    
    console.log(await gdrive.files.list());
    
    const id = (await gdrive.files.newMultipartUploader()
      .setData([1, 2, 3, 4, 5], MimeType.BINARY)
      .setRequestBody({
        name: "multipart_bin"
      })
      .execute()
    ).id;
    
    console.log(await gdrive.files.getBinary(id));

## <a name="usage_gdrive"></a>[GDrive](#c_usage_gdrive)

<hr>

Common notes:

- `queryParameters` and `requestBody` are described in the official documentation of the corresponding methods.

<hr>

1. <a name="c_about"></a>[About](#about)
2. <a name="c_files"></a>[Files](#filesfiles)
3. <a name="c_gdrive"></a>[GDrive](#gdrivegdrive)
4. <a name="c_permissions"></a>[Permissions](#permissions)

### <a name="about"></a>[About](#c_about)

This class gives [information](https://developers.google.com/drive/api/v3/reference/about) about the user, the user's Drive, and system capabilities.

Name|Type|Description
-|-|-
`get(queryParametersOrFields)`|Method, returns `Promise<`[About resource](https://developers.google.com/drive/api/v3/reference/about#resource)`>`|[Gets](https://developers.google.com/drive/api/v3/reference/about/get) information about the user, the user's Drive, and system capabilities.<br><br>`queryParametersOrFields` can be an object containing the query parameters or a string, containing a [`fields`](https://developers.google.com/drive/api/v3/reference/about/get#parameters) value.

### <a name="filesfiles"></a>[Files](#c_files)

This class is used to manage [files](https://developers.google.com/drive/api/v3/reference/files) in a google drive.

Notes:
- The parameter `range` for the methods that accept it is specified as [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) with one exception:
**\<unit\>** is always bytes and mustn't be set. E.g.:

        await gdrive.files.getBinary(fileId, null, "1-1");

    will return the byte at index one.

Name|Type|Description
-|-|-
`copy(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  queryParameters?: object,`<br>&nbsp;`  requestBody: object = {}`<br>`)`|Method, returns `Promise<`[File resource](https://developers.google.com/drive/api/v3/reference/files#resource)`>`|Creates a [copy](#https://developers.google.com/drive/api/v3/reference/files/copy) of a file.
<a name="filesfiles_create_if_not_exists"></a>`createIfNotExists(`<br>&nbsp;`  queryParameters: object,`<br>&nbsp;`  uploader:`[` Uploader`](#uploader)<br>`)`|Method, returns `Promise<`[`CreateIfNotExistsResultType`](#create_if_not_exists_result_type)`>`|Invokes [`uploader.execute()`](#uploader_execute), if the file described with `queryParameters` doesn't exist. Throws [`UnexpectedFileCountError`](#unexpected_file_count_error) if there are 2 or more files matching `queryParameters`.
`delete(fileId: string)`|Method, returns `Promise<void>`|[Deletes](https://developers.google.com/drive/api/v3/reference/files/delete) a file.
`emptyTrash()`|Method, returns `Promise<void>`|Permanently [deletes](https://developers.google.com/drive/api/v3/reference/files/emptyTrash) all of the user's trashed files.
`export(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  queryParameters: object`<br>`)`|Method, returns `Promise<`[File resource](https://developers.google.com/drive/api/v3/reference/files#resource)`>`|[Exports](https://developers.google.com/drive/api/v3/reference/files/export) a Google Doc to the requested MIME type.
`generateIds(`<br>&nbsp;`  queryParameters?: object`<br>`)`|Method, returns `Promise<`[`object`](https://developers.google.com/drive/api/v3/reference/files/generateIds#response)`>`|[Generates](https://developers.google.com/drive/api/v3/reference/files/generateIds) file IDs. [This info](https://developers.google.com/drive/api/guides/manage-uploads#use_a_pre-generated_id_to_upload_files) might seem interesting.
`get(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  queryParameters?: object,`<br>&nbsp;`  range?: string`<br>`)`|Method, returns `Promise<`[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)`>`|[Gets](https://developers.google.com/drive/api/v3/reference/files/get) the file's metadata or content.
`getBinary(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  queryParameters?: object,`<br>&nbsp;`  range?: string`<br>`)`|Method, returns `Promise<`[`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)`>`|Gets the content of a binary file.
`getContent(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  queryParameters?: object,`<br>&nbsp;`  range?: string`<br>`)`|Method, returns `Promise<`[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)`>`|Gets the content of **any** file.
`getJson(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  queryParameters?: object`<br>`)`|Method, returns `Promise<object>`|Gets the content of a json text file.
`getMetadata(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  queryParameters?: object`<br>`)`|Method, returns `Promise<`[File resource](https://developers.google.com/drive/api/v3/reference/files#resource)`>` |Gets a file's metadata.
`getText(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  queryParameters?: object,`<br>&nbsp;`  range?: string`<br>`)`|Method, returns `Promise<string>`|Gets the content of a text file.
<a name="filesfiles_list"></a>`list(`<br>&nbsp;`  queryParameters?: object`<br>`)`|Method, returns `Promise<`[`object`](https://developers.google.com/drive/api/v3/reference/files/list#response)`>`|[Lists](https://developers.google.com/drive/api/v3/reference/files/list) files.<br><br>`queryParameters.q` can be a [query string](https://developers.google.com/drive/api/guides/search-files) or a [`ListQueryBuilder`](#list_query_builder) instance.
`newMetadataOnlyUploader()`|Method, returns [`MetadataOnlyUploader`](#metadata_only_uploader)|Creates a class instance to handle a `metadata-only` upload.
<a name="filesfiles_new_multipart_uploader"></a>`newMultipartUploader()`|Method, returns [`MultipartUploader`](#multipart_uploader)|Creates a class instance to handle a [`multipart`](https://developers.google.com/drive/api/guides/manage-uploads#multipart) upload.
<a name="filesfiles_newResumableUploader"></a>`newResumableUploader()`|Method, returns [`ResumableUploader`](#resumable_uploader)|Creates a class instance to handle a [`resumable`](https://developers.google.com/drive/api/guides/manage-uploads#resumable) upload.
`newSimpleUploader()`|Method, returns [`SimpleUploader`](#simple_uploader)|Creates a class instance to handle a [`simple`](https://developers.google.com/drive/api/guides/manage-uploads#simple) upload.

### <a name="gdrivegdrive"></a>[GDrive](#c_gdrive)

A `GDrive` instance stores various api access parameters and the instances of the classes that wrap individual parts of the google drive api.

Name|Type|Description
-|-|-
`about`|Property, read/write<br>[`About`](#about) instance|The instance to get [this](https://developers.google.com/drive/api/v3/reference/about) information.
<a name="gdrivegdrive_access_token"></a>`accessToken`|Property, read/write<br>`access token`|An access token to be used in subsequent calls to the apis. Get the token from a package you choose to use.
`files`|Property, read/write<br>[`Files`](#filesfiles) instance|The instance to manage [files](https://developers.google.com/drive/api/v3/reference/files) in a google drive.
<a name="gdrivegdrive_fetch_timeout"></a>`fetchTimeout`|Property, read/write<br>`number`|A timeout in milliseconds for [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) invocations. The default value is `1500`. If the value is negative, `fetch()` will wait infinitely.
`permissions`|Property, read/write<br>[`Permissions`](#permissions) instance|The instance to manage file [permissions](https://developers.google.com/drive/api/v3/reference/permissions).

### <a name="permissions"></a>[Permissions](#c_permissions)

This class handles file [permissions](https://developers.google.com/drive/api/v3/reference/permissions).

Name|Type|Description
-|-|-
`create(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  requestBody: object,`<br>&nbsp;`  queryParameters?: object`<br>`)`|Method, returns `Promise<`[Permissions resource](https://developers.google.com/drive/api/v3/reference/permissions#resource)`>`|[Creates](https://developers.google.com/drive/api/v3/reference/permissions/create) a permission.
`delete(`<br>&nbsp;`  fileId: string,`<br>&nbsp;`  permissionId: string,`<br>&nbsp;`  queryParameters?: object`<br>`)`|Method, returns `Promise<void>`|[Deletes](https://developers.google.com/drive/api/v3/reference/permissions/delete) a permission.

## <a name="usage_uploaders"></a>[Uploaders](#c_usage_uploaders)

1. <a name="c_metadata_only_uploader"></a>[MetadataOnlyUploader](#metadata_only_uploader)
2. <a name="c_multipart_uploader"></a>[MultipartUploader](#multipart_uploader)
3. <a name="c_resumable_uploader"></a>[ResumableUploader](#resumable_uploader)
4. <a name="c_simple_uploader"></a>[SimpleUploader](#simple_uploader)
5. <a name="c_uploader"></a>[Uploader](#uploader)

### <a name="metadata_only_uploader"></a>[MetadataOnlyUploader](#c_metadata_only_uploader)

An [Uploader](#uploader) descendant, this class handles `metadata-only` uploads. It doesn't have own methods or properties.

### <a name="multipart_uploader"></a>[MultipartUploader](#c_multipart_uploader)

An [Uploader](#uploader) descendant, this class handles [`multipart`](https://developers.google.com/drive/api/guides/manage-uploads#multipart) uploads.

Name|Type|Description
-|-|-
`setIsBase64(`<br>&nbsp;`  isBase64: boolean`<br>`)`|Method, returns `this`|If the data set with [`setData()`](#uploader_set_data) is in Base64, invoke this method to add the header `Content-Transfer-Encoding: base64` which is recognized by Google Drive.
`setMultipartBoundary(`<br>&nbsp;`  multipartBoundary: string`<br>`)`|Method, returns `this`|Sets the boundary string to be used for this upload. The default value is `foo_bar_baz`.

### <a name="resumable_uploader"></a>[ResumableUploader](#c_resumable_uploader)

An [Uploader](#uploader) descendant, this class handles [`resumable`](https://developers.google.com/drive/api/guides/manage-uploads#resumable) uploads.

Name|Type|Description
-|-|-
`execute()`|Method.<br>Returns `Promise<`[`UploadChunkResultType`](#upload_chunk_result_type)`>` if data was [set](#uploader_set_data).<br>Returns `Promise<this>` otherwise.|This method sends the [initial upload request](https://developers.google.com/drive/api/guides/manage-uploads#send_the_initial_request).
<a name="resumable_uploader_request_upload_status"></a>`requestUploadStatus()`|Method, returns `Promise<`[`RequestUploadStatusResultType`](#request_upload_status_result_type)`>`|Returns the current upload status.
`setContentLength(`<br>&nbsp;`  contentLength: number`<br>`)`|Method, returns `this`|This method must be invoked to set the content length.
`setMimeType(`<br>&nbsp;`  mimeType:`&nbsp;&nbsp;[`string`](#mime_type)<br>`)`|Method, returns `this`|Sets the data MIME type when using [multiple requests](#resumable_uploader_should_use_multiple_requests).
<a name="resumable_uploader_should_use_multiple_requests"></a>`setShouldUseMultipleRequests(`<br>&nbsp;`  shouldUseMultipleRequests: boolean`<br>`)`|Method, returns `this`|Specifies whether multiple requests will be used to upload the data.
transferredByteCount|Read property (Number)|The current transferred byte count.
<a name="resumable_uploader_upload_chunk"></a>uploadChunk(chunk: [DataType](#data_type))|Method|Uploads a chunk of data, returning [`UploadChunkResultType`](#upload_chunk_result_type), wrapped in a `Promise`.

### <a name="simple_uploader"></a>[SimpleUploader](#c_simple_uploader)

An [Uploader](#uploader) descendant, this class handles [`simple`](https://developers.google.com/drive/api/guides/manage-uploads#simple) uploads. It doesn't have own methods or properties.

### <a name="uploader"></a>[Uploader](#c_uploader)

Descendants of this class handle [create](https://developers.google.com/drive/api/v3/reference/files/create) and [update](https://developers.google.com/drive/api/v3/reference/files/update) requests.

Name|Type|Description
-|-|-
<a name="uploader_execute"></a>`execute()`|Method, returns `Promise<`[File resource](https://developers.google.com/drive/api/v3/reference/files#resource)`>`|Executes the request.
<a name="uploader_set_data"></a>`setData(`<br>&nbsp;`  data:`&nbsp;&nbsp;[`Data`](#data)`,`<br>&nbsp;`  mimeType:`&nbsp;&nbsp;[`string`](#mime_type)<br>`)`|Method, returns `this`|Sets the data and its MIME type.
`setIdOfFileToUpdate(`<br>&nbsp;`  fileId: string`<br>`)`|Method, returns `this`|If this method is invoked and `fileId` is a string, the request becomes an update request. Otherwise it's a creation request.
`setQueryParameters(`<br>&nbsp;`  queryParameters: object`<br>`)`|Method, returns `this`|Sets the query parameters ([create](https://developers.google.com/drive/api/v3/reference/files/create#parameters), [update](https://developers.google.com/drive/api/v3/reference/files/update#parameters)).
`setRequestBody(`<br>&nbsp;`  requestBody: object`<br>`)`|Method, returns `this`|Sets the request body ([create](https://developers.google.com/drive/api/v3/reference/files/create#request-body), [update](https://developers.google.com/drive/api/v3/reference/files/update#request-body)).

## <a name="usage_other_entities"></a>[Other entities](#c_usage_other_entities)

1. <a name="c_create_if_not_exists_result_type"></a>[CreateIfNotExistsResultType](#create_if_not_exists_result_type)
2. <a name="c_data"></a>[Data](#data)
3. <a name="c_http_error"></a>[HttpError](#http_error)
4. <a name="c_list_query_builder"></a>[ListQueryBuilder](#list_query_builder)
5. <a name="c_mime_type"></a>[MimeType](#mime_type)
6. <a name="c_request_upload_status_result_type"></a>[RequestUploadStatusResultType](#request_upload_status_result_type)
7. <a name="c_unexpected_file_count_error"></a>[UnexpectedFileCountError](#unexpected_file_count_error)
8. <a name="c_upload_chunk_result_type"></a>[UploadChunkResultType](#upload_chunk_result_type)

### <a name="create_if_not_exists_result_type"></a>[CreateIfNotExistsResultType](#c_create_if_not_exists_result_type)

This interface describes the result type of [`Files.createIfNotExists()`](#filesfiles_create_if_not_exists).

Name|Type|Description
-|-|-
`alreadyExisted`|`boolean`|`true` if the file already existed before the method invocation, `false` otherwise.
`result`|`object`|A [file resource](https://developers.google.com/drive/api/v3/reference/files#resource), describing the existing file, if `alreadyExisted` is `true`.<br>The result of invoking [`Uploader.execute()`](#uploader_execute) if `alreadyExisted` is `false`.

### <a name="data"></a>[Data](#c_data)

`Uint8Array | number[] | string`

### <a name="http_error"></a>[HttpError](#c_http_error)

An instance of this class is thrown when an api call fails.

Name|Type|Description
-|-|-
`json`|Property, read<br>`object`|An object describing the error. Can be `undefined`.
`message`|Property, read<br>`string`|The original response text.
`response`|Property, read<br>`object`|The result of [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch).

### <a name="list_query_builder"></a>[ListQueryBuilder](#c_list_query_builder)

A helper class for building [`Files.list()`](#filesfiles_list) [queries](https://developers.google.com/drive/api/guides/search-files). It uses the following type declarations:
- `type Key = string`
- `type Value = boolean | number | string`
- `type KeyOrValue = Key | Value`

Example:

    // = List files contained in the root folder and named "Untitled" = //
    const folderIdNotItsName = "root";
    
    await gdrive.files.list({
      q: new ListQueryBuilder()
        .e("name", "Untitled")
        .and()
        .in(folderIdNotItsName, "parents")
    });

Name|Type|Description
-|-|-
`and()`|Method, returns `this`|`and`s two subqueries.
`contains(`<br>&nbsp;`  key: Key,`<br>&nbsp;`  value: Value,`<br>&nbsp;`  quoteValueIfString = true`<br>`)`|Method, returns `this`|`key contains value`
`e(`<br>&nbsp;`  key: Key,`<br>&nbsp;`  value: Value,`<br>&nbsp;`  quoteValueIfString = true`<br>`)`|Method, returns `this`|`key = value`
`g(`<br>&nbsp;`  key: Key,`<br>&nbsp;`  value: Value,`<br>&nbsp;`  quoteValueIfString = true`<br>`)`|Method, returns `this`|`key > value`
`in(`<br>&nbsp;`  value: Value,`<br>&nbsp;`  key: Key,`<br>&nbsp;`  quoteValueIfString = true`<br>`)`|Method, returns `this`|`value in key`
`l(`<br>&nbsp;`  key: Key,`<br>&nbsp;`  value: Value,`<br>&nbsp;`  quoteValueIfString = true`<br>`)`|Method, returns `this`|`key < value`
`operator(`<br>&nbsp;`  left: KeyOrValue,`<br>&nbsp;`  operator: string,`<br>&nbsp;`  right: KeyOrValue,`<br>&nbsp;`  quoteLeftIfString: boolean,`<br>&nbsp;`  quoteRightIfString: boolean`<br>`)`|Method, returns `this`|A generic method to build all the other key/value relations.
`or()`|Method, returns `this`|`or`s two subqueries.
`pop()`|Method, returns `this`|Adds `)`.
`push()`|Method, returns `this`|Adds `(`.
`toString()`|Method, returns `string`|Stringifies the query.

### <a name="mime_type"></a>[MimeType](#c_mime_type)

This enum holds commonly used MIME types.

Name|Type
-|-
`BINARY`|`application/octet-stream`
`CSV`|`text/csv`
`FOLDER`|`application/vnd.google-apps.folder`
`JSON`|`application/json`
`JSON_UTF8`|`application/json; charset=UTF-8`
`PDF`|`application/pdf`
`TEXT`|`text/plain`

### <a name="request_upload_status_result_type"></a>[RequestUploadStatusResultType](#c_request_upload_status_result_type)

This interface describes the result type of [ResumableUploader.requestUploadStatus()](#resumable_uploader_request_upload_status).

Name|Type|Description
-|-|-
`isComplete`|`boolean`|`true` if the upload is completed, `false` otherwise.
`transferredByteCount`|`number`|The number of bytes currently transferred.

### <a name="unexpected_file_count_error"></a>[UnexpectedFileCountError](#c_unexpected_file_count_error)

An instance of this class is thrown when the real number of files differs from the expected.

Name|Type|Description
-|-|-
expectedCount|Property, read<br>`number[] \| number`|The expected count.
realCount|Property, read<br>`number`|Real count.

### <a name="upload_chunk_result_type"></a>[UploadChunkResultType](#c_upload_chunk_result_type)

Extending [RequestUploadStatusResultType](#request_upload_status_result_type), this interface describes the result type of [ResumableUploader.uploadChunk()](#resumable_uploader_upload_chunk).

Name|Type|Description
-|-|-
`json`|`any?`|This field will contain a [file resource](https://developers.google.com/drive/api/v3/reference/files#resource), describing the file, if `isComplete` is `true`.
