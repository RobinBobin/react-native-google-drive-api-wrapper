This wrapper facilitates the use of the [Google Drive API v3](https://developers.google.com/drive/v3/reference/).

It doesn't provide any authorization mechanism, so another package has to be used. I use [@react-native-google-signin/google-signin](https://www.npmjs.com/package/@react-native-google-signin/google-signin) (thanks for the great work, [vonovak](https://www.npmjs.com/~vonovak)!).

If something doesn't work as expected, please do have a look at an example [project](https://github.com/RobinBobin/gdrivetest) before opening an issue.

# Table of contents

1. <a id="c_installation"></a>[Installation](#installation)
2. <a id="c_usage"></a>[Usage](#usage)
   1. <a id="c_usage_examples"></a>[Examples](#usage_examples)
   1. <a id="c_usage_api"></a>[API](#usage_api)
   1. <a id="c_usage_uploaders"></a>[Uploaders](#usage_uploaders)
   1. <a id="c_usage_other_entities"></a>[Other entities](#usage_other_entities)

# <a id="installation"></a>[Installation](#c_installation)

    npm i @robinbobin/react-native-google-drive-api-wrapper

# <a id="usage"></a>[Usage](#c_usage)

<a id="usage_examples"></a>Examples:

    // General setup

    import { GoogleSignin } from '@react-native-google-signin/google-signin'
    import { INFINITE_TIMEOUT, GDrive } from '@robinbobin/react-native-google-drive-api-wrapper'

    ...

    // Somewhere in your code
    GoogleSignin.configure(...)

    await GoogleSignin.signIn()

    const gdrive = new GDrive()

    gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken

    // fetch() invocations wait infinitely
    // gdrive.fetchTimeout = INFINITE_TIMEOUT

<!-- -->

    // List files

    await gdrive.files.list(...)

<!-- -->

    // List files in `appDataFolder`

    import { APP_DATA_FOLDER_ID } from '@robinbobin/react-native-google-drive-api-wrapper'

    ...

    await gdrive.files.list({ ..., spaces: APP_DATA_FOLDER_ID })

<!-- -->

    // Create a binary file and read it

    import { mimeTypes } from '@robinbobin/react-native-google-drive-api-wrapper'

    ...

    const file = await gdrive.files.newMultipartUploader()
      .setData([1, 2, 3, 4, 5])
      .setDataMimeType(mimeTypes.application.octetStream)
      .setRequestBody({ name: "multipart_bin" })
      .execute()

    console.log(await gdrive.files.getBinary(file.id))

## <a id="usage_api"></a>[API](#c_usage_api)

1. <a id="c_about"></a>[About](#about)
2. <a id="c_files"></a>[Files](#files)
3. <a id="c_gdrive"></a>[GDrive](#gdrive)
4. <a id="c_permissions"></a>[Permissions](#permissions)

Notes:

- `STANDARD_PARAMETERS_FIELDS_ALL` can be used instead of `*` as a value for `fields` in `queryParameters` of different methods:

      import { STANDARD_PARAMETERS_FIELDS_ALL } from '@robinbobin/react-native-google-drive-api-wrapper'

      ...

      await gdrive.about.get(STANDARD_PARAMETERS_FIELDS_ALL)

### <a id="about"></a>[About](#c_about)

This class gives [information](https://developers.google.com/drive/api/v3/reference/about) about the user, the user's Drive, and system capabilities.

| Name                          | Description                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="about_get"></a>`get()` | [Gets](https://developers.google.com/drive/api/v3/reference/about/get) information about the user, the user's Drive, and system capabilities.<br><br>Parameters:<ul><li>`queryParameters:` [TAboutGetQueryParameters](#t_about_get_query_parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<`[About resource](https://developers.google.com/drive/api/v3/reference/about#resource)`>`</li></ul> |

### <a id="files"></a>[Files](#c_files)

This class is used to manage [files](https://developers.google.com/drive/api/v3/reference/files) in a google drive.

Notes:

- The parameter `range` for the methods that accept it is specified as [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) with one exception:
  **\<unit\>** is always `bytes` and mustn't be set. E.g.:

      await gdrive.files.getBinary('bin_file_id', { range: '1-1' })

  will return the byte at index one.

- `ROOT_FOLDER_ID` can be used instead of `root`:

      import { ROOT_FOLDER_ID } from '@robinbobin/react-native-google-drive-api-wrapper'

| Name                                                         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `copy()`                                                     | Creates a [copy](#https://developers.google.com/drive/api/v3/reference/files/copy) of a file.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`parameters?:` [IFilesCopyParameters](#i_files_copy_parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<`[File resource](https://developers.google.com/drive/api/v3/reference/files#resource)`>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| <a id="files_create_if_not_exists"></a>`createIfNotExists()` | Conditionally creates a [file resource](https://developers.google.com/drive/api/v3/reference/files#resource).<br><br>Parameters:<ul><li>`queryParameters:` [query parameters](https://developers.google.com/drive/api/reference/rest/v3/files/list#query-parameters)</li><li>`uploader:` an [`Uploader`](#uploader) descendant</li></ul>Description:<ul style="list-style-type:none;"><li>The function uses `uploader` to create a [file resource](https://developers.google.com/drive/api/v3/reference/files#resource) if the file resource described with `queryParameters` doesn't exist.</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<`[`ICreateIfNotExistsResultType`](#i_create_if_not_exists_result_type)`>`</li></ul>Throws:<ul style="list-style-type:none;"><li>[`UnexpectedFileCountError`](#unexpected_file_count_error) if there are 2 or more files matching `queryParameters`.</li></ul> |
| `delete()`                                                   | [Deletes](https://developers.google.com/drive/api/v3/reference/files/delete) a file **without moving it to the trash**.<br><br>Parameters:<ul><li>`fileId: string`</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<void>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `emptyTrash()`                                               | Permanently [deletes](https://developers.google.com/drive/api/v3/reference/files/emptyTrash) all of the user's trashed files.<br><br>Returns:<ul style="list-style-type:none;"><li>`Promise<void>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `export()`                                                   | [Exports](https://developers.google.com/drive/api/v3/reference/files/export) a Google Doc to the requested MIME type.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`queryParameters:` [query parameters](https://developers.google.com/drive/api/reference/rest/v3/files/export#query-parameters)</li></ul>Returns:<ul><li>`Promise<`[`TBlobToByteArrayResultType`](#t_blob_to_byte_array_result_type)`>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `generateIds()`                                              | [Generates](https://developers.google.com/drive/api/v3/reference/files/generateIds) file IDs. [This info](https://developers.google.com/drive/api/guides/manage-uploads#pre-generated) might seem interesting.<br><br>Parameters:<ul><li>`queryParameters?:` [query parameters](https://developers.google.com/drive/api/reference/rest/v3/files/generateIds#query-parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<`[`json data`](https://developers.google.com/drive/api/v3/reference/files/generateIds#response-body)`>`</li></ul>                                                                                                                                                                                                                                                                                                                                                            |
| `get()`                                                      | [Gets](https://developers.google.com/drive/api/v3/reference/files/get) the file metadata or content.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`parameters?:` [`IFilesGetParameters`](#i_files_get_parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<`[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)`>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `getBinary()`                                                | Gets the file content as binary data.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`parameters?:` [`IFilesGetParameters`](#i_files_get_parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<`[`TBlobToByteArrayResultType`](#t_blob_to_byte_array_result_type)`>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `getContent()`                                               | Gets the file content.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`parameters?:` [`IFilesGetParameters`](#i_files_get_parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<`[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)`>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `getJson<T = JsonObject>()`                                  | Gets the file content as json.<br><br>A template parameter can be supplied to type the return value. The default is [`JsonObject`](https://github.com/sindresorhus/type-fest?tab=readme-ov-file#json), which "matches a JSON object".<br><br>Parameters:<ul><li>`fileId: string`</li><li>`queryParameters?:` [`IFilesGetQueryParameters`](https://developers.google.com/drive/api/reference/rest/v3/files/get#query-parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<T>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                              |
| `getMetadata()`                                              | Gets the file metadata.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`queryParameters?:` [`IFilesGetQueryParameters`](https://developers.google.com/drive/api/reference/rest/v3/files/get#query-parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<`[File resource](https://developers.google.com/drive/api/v3/reference/files#resource)`>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `getText()`                                                  | Gets the file content as text.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`parameters?:` [`IFilesGetParameters`](#i_files_get_parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<string>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `list()`                                                     | [Lists](https://developers.google.com/drive/api/v3/reference/files/list) files.<br><br>Parameters:<ul><li>`queryParameters?:` [query parameters](https://developers.google.com/drive/api/reference/rest/v3/files/list#query-parameters)</li></ul><br>`queryParameters.q` can be a [query string](https://developers.google.com/drive/api/guides/search-files) or a [`ListQueryBuilder`](#list_query_builder) instance.<br><br>Returns:<ul style="list-style-type:none;"><li>`Promise<`[`json data`](https://developers.google.com/drive/api/reference/rest/v3/files/list#response-body)`>`</li></ul>                                                                                                                                                                                                                                                                                                                       |
| `newMetadataOnlyUploader()`                                  | Creates a class instance to perform a [metadata-only](https://developers.google.com/drive/api/guides/create-file#create-metadata-file) upload.<br><br>Returns:<ul style="list-style-type:none;"><li>[`MetadataOnlyUploader`](#metadata_only_uploader)</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `newMultipartUploader()`                                     | Creates a class instance to perform a [multipart](https://developers.google.com/drive/api/guides/manage-uploads#multipart) upload.<br><br>Returns:<ul style="list-style-type:none;"><li>[`MultipartUploader`](#multipart_uploader)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `newResumableUploader()`                                     | Creates a class instance to perform a [resumable](https://developers.google.com/drive/api/guides/manage-uploads#resumable) upload.<br><br>Returns:<ul style="list-style-type:none;"><li>[`ResumableUploader`](#resumable_uploader)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `newSimpleUploader()`                                        | Creates a class instance to perform a [simple](https://developers.google.com/drive/api/guides/manage-uploads#simple) upload.<br><br>Returns:<ul style="list-style-type:none;"><li>[`SimpleUploader`](#simple_uploader)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

### <a id="gdrivegdrive"></a>[GDrive](#c_gdrive)

A `GDrive` instance stores various api access parameters and the instances of the classes that wrap individual parts of the google drive api.

| Name           | Description                                                                                                                                                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `about`        | A read-only property storing the [`About`](#about) instance.                                                                                                                                                                                  |
| `accessToken`  | A read/write property storing an access token to be used in subsequent calls to the apis.                                                                                                                                                     |
| `fetchTimeout` | A read/write property storing a timeout in milliseconds for [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) invocations. The default value is `1500`. If the value is `INFINITE_TIMEOUT`, `fetch()` will wait infinitely. |
| `files`        | A read-only property storing the [`Files`](#files) instance.                                                                                                                                                                                  |
| `permissions`  | A read-only property storing the [`Permissions`](#permissions) instance.                                                                                                                                                                      |

### <a id="permissions"></a>[Permissions](#c_permissions)

This class handles file [permissions](https://developers.google.com/drive/api/v3/reference/permissions).

| Name       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create()` | [Creates](https://developers.google.com/drive/api/v3/reference/permissions/create) a permission.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`requestBody:` [request body](https://developers.google.com/drive/api/reference/rest/v3/permissions#Permission)</li><li>`queryParameters?:` [query parameters](https://developers.google.com/drive/api/reference/rest/v3/permissions/create#query-parameters)</li></ul>Returns:<ul style="list-style-type:none;">[permission resource](https://developers.google.com/drive/api/reference/rest/v3/permissions#Permission)<li> |
| `delete()` | [Deletes](https://developers.google.com/drive/api/v3/reference/permissions/delete) a permission.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`permissionId: string`</li><li>`queryParameters?:` [query parameters](https://developers.google.com/drive/api/reference/rest/v3/permissions/delete#query-parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<void>`</li></ul>                                                                                                                                                                        |

## <a id="usage_uploaders"></a>[Uploaders](#c_usage_uploaders)

1. <a id="c_metadata_only_uploader"></a>[MetadataOnlyUploader](#metadata_only_uploader)
2. <a id="c_multipart_uploader"></a>[MultipartUploader](#multipart_uploader)
3. <a id="c_resumable_uploader"></a>[ResumableUploader](#resumable_uploader)
4. <a id="c_simple_uploader"></a>[SimpleUploader](#simple_uploader)
5. <a id="c_uploader"></a>[Uploader](#uploader)

### <a id="metadata_only_uploader"></a>[MetadataOnlyUploader](#c_metadata_only_uploader)

An [Uploader](#uploader) descendant, this class handles `metadata-only` uploads. It doesn't have own methods or properties.

### <a id="multipart_uploader"></a>[MultipartUploader](#c_multipart_uploader)

An [Uploader](#uploader) descendant, this class handles [`multipart`](https://developers.google.com/drive/api/guides/manage-uploads#multipart) uploads.

| Name                                                                  | Type           | Description                                                                                                                                                                        |
| --------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setIsBase64(`<br>&nbsp;`  isBase64: boolean`<br>`)`                  | Returns `this` | If the data set with [`setData()`](#uploader_set_data) is in Base64, invoke this method to add the header `Content-Transfer-Encoding: base64` which is recognized by Google Drive. |
| `setMultipartBoundary(`<br>&nbsp;`  multipartBoundary: string`<br>`)` | Returns `this` | Sets the boundary string to be used for this upload. The default value is `foo_bar_baz`.                                                                                           |

### <a id="resumable_uploader"></a>[ResumableUploader](#c_resumable_uploader)

An [Uploader](#uploader) descendant, this class handles [`resumable`](https://developers.google.com/drive/api/guides/manage-uploads#resumable) uploads.

| Name                                                                                                                                                 | Type                                                                                                                                                              | Description                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `execute()`                                                                                                                                          | Method.<br>Returns `Promise<`[`UploadChunkResultType`](#upload_chunk_result_type)`>` if data was [set](#uploader_set_data).<br>Returns `Promise<this>` otherwise. | This method sends the [initial upload request](https://developers.google.com/drive/api/guides/manage-uploads#send_the_initial_request). |
| <a name="resumable_uploader_request_upload_status"></a>`requestUploadStatus()`                                                                       | Returns `Promise<`[`RequestUploadStatusResultType`](#request_upload_status_result_type)`>`                                                                        | Returns the current upload status.                                                                                                      |
| `setContentLength(`<br>&nbsp;`  contentLength: number`<br>`)`                                                                                        | Returns `this`                                                                                                                                                    | This method must be invoked to set the content length.                                                                                  |
| `setMimeType(`<br>&nbsp;`  mimeType:`&nbsp;&nbsp;[`string`](#mime_type)<br>`)`                                                                       | Returns `this`                                                                                                                                                    | Sets the data MIME type when using [multiple requests](#resumable_uploader_should_use_multiple_requests).                               |
| <a name="resumable_uploader_should_use_multiple_requests"></a>`setShouldUseMultipleRequests(`<br>&nbsp;`  shouldUseMultipleRequests: boolean`<br>`)` | Returns `this`                                                                                                                                                    | Specifies whether multiple requests will be used to upload the data.                                                                    |
| transferredByteCount                                                                                                                                 | Read property (Number)                                                                                                                                            | The current transferred byte count.                                                                                                     |
| <a name="resumable_uploader_upload_chunk"></a>uploadChunk(chunk: [DataType](#data_type))                                                             | Method                                                                                                                                                            | Uploads a chunk of data, returning [`UploadChunkResultType`](#upload_chunk_result_type), wrapped in a `Promise`.                        |

### <a id="simple_uploader"></a>[SimpleUploader](#c_simple_uploader)

An [Uploader](#uploader) descendant, this class handles [`simple`](https://developers.google.com/drive/api/guides/manage-uploads#simple) uploads. It doesn't have own methods or properties.

### <a id="uploader"></a>[Uploader](#c_uploader)

Descendants of this class handle [create](https://developers.google.com/drive/api/v3/reference/files/create) and [update](https://developers.google.com/drive/api/v3/reference/files/update) requests.

| Name                                                                                                                                                        | Type                                                                                                      | Description                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a name="uploader_execute"></a>`execute()`                                                                                                                  | Returns `Promise<`[File resource](https://developers.google.com/drive/api/v3/reference/files#resource)`>` | Executes the request.                                                                                                                                                                                       |
| <a name="uploader_set_data"></a>`setData(`<br>&nbsp;`  data:`&nbsp;&nbsp;[`Data`](#data)`,`<br>&nbsp;`  mimeType:`&nbsp;&nbsp;[`string`](#mime_type)<br>`)` | Returns `this`                                                                                            | Sets the data and its MIME type.                                                                                                                                                                            |
| `setIdOfFileToUpdate(`<br>&nbsp;`  fileId: string`<br>`)`                                                                                                   | Returns `this`                                                                                            | If this method is invoked and `fileId` is a string, the request becomes an update request. Otherwise it's a creation request.                                                                               |
| `setQueryParameters(`<br>&nbsp;`  queryParameters: object`<br>`)`                                                                                           | Returns `this`                                                                                            | Sets the query parameters ([create](https://developers.google.com/drive/api/v3/reference/files/create#parameters), [update](https://developers.google.com/drive/api/v3/reference/files/update#parameters)). |
| `setRequestBody(`<br>&nbsp;`  requestBody: object`<br>`)`                                                                                                   | Returns `this`                                                                                            | Sets the request body ([create](https://developers.google.com/drive/api/v3/reference/files/create#request-body), [update](https://developers.google.com/drive/api/v3/reference/files/update#request-body)). |

## <a id="usage_other_entities"></a>[Other entities](#c_usage_other_entities)

1. <a id="c_i_create_if_not_exists_result_type"></a>[ICreateIfNotExistsResultType](#i_create_if_not_exists_result_type)
2. <a id="c_data"></a>[Data](#data)
3. <a id="c_http_error"></a>[HttpError](#http_error)
4. <a id="c_list_query_builder"></a>[ListQueryBuilder](#list_query_builder)
5. <a id="c_mime_type"></a>[MimeType](#mime_type)
6. <a id="c_request_upload_status_result_type"></a>[RequestUploadStatusResultType](#request_upload_status_result_type)
7. <a id="c_unexpected_file_count_error"></a>[UnexpectedFileCountError](#unexpected_file_count_error)
8. <a id="c_upload_chunk_result_type"></a>[UploadChunkResultType](#upload_chunk_result_type)

### <a id="i_create_if_not_exists_result_type"></a>[ICreateIfNotExistsResultType](#c_i_create_if_not_exists_result_type)

This interface describes the result type of [`Files.createIfNotExists()`](#files_create_if_not_exists).

| Name             | Type      | Description                                                                                                                                                                                                                                              |
| ---------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `alreadyExisted` | `boolean` | `true` if the file already existed before the method invocation, `false` otherwise.                                                                                                                                                                      |
| `result`         | `object`  | A [file resource](https://developers.google.com/drive/api/v3/reference/files#resource), describing the existing file, if `alreadyExisted` is `true`.<br>The result of invoking [`Uploader.execute()`](#uploader_execute) if `alreadyExisted` is `false`. |

### <a id="data"></a>[Data](#c_data)

`Uint8Array | number[] | string`

### <a id="http_error"></a>[HttpError](#c_http_error)

An instance of this class is thrown when an api call fails.

| Name       | Type                       | Description                                                                        |
| ---------- | -------------------------- | ---------------------------------------------------------------------------------- |
| `json`     | Property, read<br>`object` | An object describing the error. Can be `undefined`.                                |
| `message`  | Property, read<br>`string` | The original response text.                                                        |
| `response` | Property, read<br>`object` | The result of [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch). |

### <a id="list_query_builder"></a>[ListQueryBuilder](#c_list_query_builder)

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

| Name                                                                                                                                                                                               | Type             | Description                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------ |
| `and()`                                                                                                                                                                                            | Returns `this`   | `and`s two subqueries.                                       |
| `contains(`<br>&nbsp;`  key: Key,`<br>&nbsp;`  value: Value,`<br>&nbsp;`  quoteValueIfString = true`<br>`)`                                                                                        | Returns `this`   | `key contains value`                                         |
| `e(`<br>&nbsp;`  key: Key,`<br>&nbsp;`  value: Value,`<br>&nbsp;`  quoteValueIfString = true`<br>`)`                                                                                               | Returns `this`   | `key = value`                                                |
| `g(`<br>&nbsp;`  key: Key,`<br>&nbsp;`  value: Value,`<br>&nbsp;`  quoteValueIfString = true`<br>`)`                                                                                               | Returns `this`   | `key > value`                                                |
| `in(`<br>&nbsp;`  value: Value,`<br>&nbsp;`  key: Key,`<br>&nbsp;`  quoteValueIfString = true`<br>`)`                                                                                              | Returns `this`   | `value in key`                                               |
| `l(`<br>&nbsp;`  key: Key,`<br>&nbsp;`  value: Value,`<br>&nbsp;`  quoteValueIfString = true`<br>`)`                                                                                               | Returns `this`   | `key < value`                                                |
| `operator(`<br>&nbsp;`  left: KeyOrValue,`<br>&nbsp;`  operator: string,`<br>&nbsp;`  right: KeyOrValue,`<br>&nbsp;`  quoteLeftIfString: boolean,`<br>&nbsp;`  quoteRightIfString: boolean`<br>`)` | Returns `this`   | A generic method to build all the other key/value relations. |
| `or()`                                                                                                                                                                                             | Returns `this`   | `or`s two subqueries.                                        |
| `pop()`                                                                                                                                                                                            | Returns `this`   | Adds `)`.                                                    |
| `push()`                                                                                                                                                                                           | Returns `this`   | Adds `(`.                                                    |
| `toString()`                                                                                                                                                                                       | Returns `string` | Stringifies the query.                                       |

### <a id="mime_type"></a>[MimeType](#c_mime_type)

This enum holds commonly used MIME types.

| Name        | Type                                 |
| ----------- | ------------------------------------ |
| `BINARY`    | `application/octet-stream`           |
| `CSV`       | `text/csv`                           |
| `FOLDER`    | `application/vnd.google-apps.folder` |
| `JSON`      | `application/json`                   |
| `JSON_UTF8` | `application/json; charset=UTF-8`    |
| `PDF`       | `application/pdf`                    |
| `TEXT`      | `text/plain`                         |

### <a id="request_upload_status_result_type"></a>[RequestUploadStatusResultType](#c_request_upload_status_result_type)

This interface describes the result type of [ResumableUploader.requestUploadStatus()](#resumable_uploader_request_upload_status).

| Name                   | Type      | Description                                           |
| ---------------------- | --------- | ----------------------------------------------------- |
| `isComplete`           | `boolean` | `true` if the upload is completed, `false` otherwise. |
| `transferredByteCount` | `number`  | The number of bytes currently transferred.            |

### <a id="unexpected_file_count_error"></a>[UnexpectedFileCountError](#c_unexpected_file_count_error)

An instance of this class is [thrown](#files_create_if_not_exists) when the real number of files differs from the expected.

| Name          | Type                                   | Description         |
| ------------- | -------------------------------------- | ------------------- |
| expectedCount | Property, read<br>`number[] \| number` | The expected count. |
| realCount     | Property, read<br>`number`             | Real count.         |

### <a id="upload_chunk_result_type"></a>[UploadChunkResultType](#c_upload_chunk_result_type)

Extending [RequestUploadStatusResultType](#request_upload_status_result_type), this interface describes the result type of [ResumableUploader.uploadChunk()](#resumable_uploader_upload_chunk).

| Name   | Type   | Description                                                                                                                                                     |
| ------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `json` | `any?` | This field will contain a [file resource](https://developers.google.com/drive/api/v3/reference/files#resource), describing the file, if `isComplete` is `true`. |
