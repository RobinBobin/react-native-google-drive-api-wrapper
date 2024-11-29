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

    import { MIME_TYPES } from '@robinbobin/react-native-google-drive-api-wrapper'

    ...

    const file = await gdrive.files.newMultipartUploader()
      .setData([1, 2, 3, 4, 5])
      .setDataMimeType(MIME_TYPES.application.octetStream)
      .setRequestBody({ name: "multipart_bin" })
      .execute()

    console.log(await gdrive.files.getBinary(file.id))

## <a id="usage_api"></a>[API](#c_usage_api)

1. <a id="c_about"></a>[About](#about)
2. <a id="c_files"></a>[Files](#files)
3. <a id="c_gdrive"></a>[GDrive](#gdrive)
4. <a id="c_permissions"></a>[Permissions](#permissions)

Notes:

- `STANDARD_PARAMETERS_FIELDS_ALL` can be used instead of `*` as a value for `fields` in `queryParameters` of all methods:

      import { STANDARD_PARAMETERS_FIELDS_ALL } from '@robinbobin/react-native-google-drive-api-wrapper'

      ...

      await gdrive.about.get(STANDARD_PARAMETERS_FIELDS_ALL)

- Query parameters of certain methods have string properties containing a comma-separated list of some values (e.g. `spaces` in [`list`](https://developers.google.com/drive/api/reference/rest/v3/files/list#query-parameters)). This wrapper accepts `string` and `string[]` values for these properties. `string` values are passed as-is, and `string[]` values are converted to comma-separated lists.

### <a id="about"></a>[About](#c_about)

This class gives [information](https://developers.google.com/drive/api/v3/reference/about) about the user, the user's Drive, and system capabilities.

| Name                          | Description                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="about_get"></a>`get()` | [Gets](https://developers.google.com/drive/api/v3/reference/about/get) information about the user, the user's Drive, and system capabilities.<br><br>Parameters:<ul><li>`queryParameters:` [TAboutGetQueryParameters](#t_about_get_query_parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<`[About resource](https://developers.google.com/drive/api/v3/reference/about#resource)`>`</li></ul> |

### <a id="files"></a>[Files](#c_files)

This class is used to manage [files](https://developers.google.com/drive/api/v3/reference/files) in a google drive.

Notes:

- The parameter <a id="files_get_range"></a>`range` for the methods that accept it is specified as [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) with one exception:
  **\<unit\>** is always `bytes` and mustn't be set. E.g.:

      await gdrive.files.getBinary('bin_file_id', { range: '1-1' })

  will return the byte at index one.

- `ROOT_FOLDER_ID` can be used instead of `'root'`:

      import { ROOT_FOLDER_ID } from '@robinbobin/react-native-google-drive-api-wrapper'

| Name                                                                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="files_copy"></a>`copy()`                                          | Creates a [copy](https://developers.google.com/drive/api/v3/reference/files/copy) of a file.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`parameters?:` [IFilesCopyParameters](#i_files_copy_parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<`[File resource](https://developers.google.com/drive/api/v3/reference/files#resource)`>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| <a id="files_create_if_not_exists"></a>`createIfNotExists()`             | Conditionally creates a [file resource](https://developers.google.com/drive/api/v3/reference/files#resource).<br><br>Parameters:<ul><li>`queryParameters:` [query parameters](https://developers.google.com/drive/api/reference/rest/v3/files/list#query-parameters)</li><li>`uploader:` an [uploader](#usage_uploaders)</li></ul>Description:<ul style="list-style-type:none;"><li>The function will use `uploader` to create a [file resource](https://developers.google.com/drive/api/v3/reference/files#resource) if the file resource described with `queryParameters` doesn't exist.</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<`[`ICreateIfNotExistsResultType`](#i_create_if_not_exists_result_type)`>`</li></ul>Throws:<ul style="list-style-type:none;"><li>[`UnexpectedFileCountError`](#unexpected_file_count_error) if there are 2 or more files matching `queryParameters`.</li></ul> |
| `delete()`                                                               | [Deletes](https://developers.google.com/drive/api/v3/reference/files/delete) a file **without moving it to the trash**.<br><br>Parameters:<ul><li>`fileId: string`</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<void>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `emptyTrash()`                                                           | Permanently [deletes](https://developers.google.com/drive/api/v3/reference/files/emptyTrash) all of the user's trashed files.<br><br>Returns:<ul style="list-style-type:none;"><li>`Promise<void>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `export()`                                                               | [Exports](https://developers.google.com/drive/api/v3/reference/files/export) a Google Doc to the requested MIME type.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`queryParameters:` [query parameters](https://developers.google.com/drive/api/reference/rest/v3/files/export#query-parameters)</li></ul>Returns:<ul><li>`Promise<`[`TBlobToByteArrayResultType`](#t_blob_to_byte_array_result_type)`>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `generateIds()`                                                          | [Generates](https://developers.google.com/drive/api/v3/reference/files/generateIds) file IDs. [This info](https://developers.google.com/drive/api/guides/manage-uploads#pre-generated) might seem interesting.<br><br>Parameters:<ul><li>`queryParameters?:` [query parameters](https://developers.google.com/drive/api/reference/rest/v3/files/generateIds#query-parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<`[response body](https://developers.google.com/drive/api/v3/reference/files/generateIds#response-body)`>`</li></ul>                                                                                                                                                                                                                                                                                                                                                        |
| <a id="files_get"></a>`get()`                                            | [Gets](https://developers.google.com/drive/api/v3/reference/files/get) the file metadata or content.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`parameters?:` [`IFilesGetParameters`](#i_files_get_parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<`[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)`>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `getBinary()`                                                            | Gets the file content as binary data.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`parameters?:` [`IFilesGetParameters`](#i_files_get_parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<`[`TBlobToByteArrayResultType`](#t_blob_to_byte_array_result_type)`>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `getContent()`                                                           | Gets the file content.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`parameters?:` [`IFilesGetParameters`](#i_files_get_parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<`[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)`>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `getJson<T = JsonObject>()`                                              | Gets the file content as JSON.<br><br>A template parameter can be supplied to type the return value. If omitted, a JSON object will be returned.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`queryParameters?:` [query parameters](https://developers.google.com/drive/api/reference/rest/v3/files/get#query-parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<T>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `getMetadata()`                                                          | Gets the file metadata.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`queryParameters?:` [query parameters](https://developers.google.com/drive/api/reference/rest/v3/files/get#query-parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<`[File resource](https://developers.google.com/drive/api/v3/reference/files#resource)`>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `getText()`                                                              | Gets the file content as text.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`parameters?:` [`IFilesGetParameters`](#i_files_get_parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<string>`</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| <a id="files_list"></a>`list()`                                          | [Lists](https://developers.google.com/drive/api/v3/reference/files/list) files.<br><br>Parameters:<ul><li>`queryParameters?:` [query parameters](https://developers.google.com/drive/api/reference/rest/v3/files/list#query-parameters)</li></ul><br>`queryParameters.q` can be a [query string](https://developers.google.com/drive/api/guides/search-files) or a [`ListQueryBuilder`](#list_query_builder) instance.<br><br>Returns:<ul style="list-style-type:none;"><li>`Promise<`[response body](https://developers.google.com/drive/api/reference/rest/v3/files/list#response-body)`>`</li></ul>                                                                                                                                                                                                                                                                                                                   |
| <a id="files_new_metadata_only_uploader"></a>`newMetadataOnlyUploader()` | Creates a class instance to perform a [metadata-only](https://developers.google.com/drive/api/guides/create-file#create-metadata-file) upload.<br><br>Returns:<ul style="list-style-type:none;"><li>[`MetadataOnlyUploader`](#metadata_only_uploader)</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| <a id="files_new_multipart_uploader"></a>`newMultipartUploader()`        | Creates a class instance to perform a [multipart](https://developers.google.com/drive/api/guides/manage-uploads#multipart) upload.<br><br>Returns:<ul style="list-style-type:none;"><li>[`MultipartUploader`](#multipart_uploader)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| <a id="files_new_resumable_uploader"></a>`newResumableUploader()`        | Creates a class instance to perform a [resumable](https://developers.google.com/drive/api/guides/manage-uploads#resumable) upload.<br><br>Returns:<ul style="list-style-type:none;"><li>[`ResumableUploader`](#resumable_uploader)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| <a id="files_new_simple_uploader"></a>`newSimpleUploader()`              | Creates a class instance to perform a [simple](https://developers.google.com/drive/api/guides/manage-uploads#simple) upload.<br><br>Returns:<ul style="list-style-type:none;"><li>[`SimpleUploader`](#simple_uploader)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

### <a id="gdrivegdrive"></a>[GDrive](#c_gdrive)

A `GDrive` instance stores various api access parameters and the instances of the classes that wrap individual parts of the google drive api.

| Name           | Description                                                                                                                                                                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `about`        | This read-only property stores the [`About`](#about) instance.                                                                                                                                                                                  |
| `accessToken`  | This read/write property stores an access token to be used in subsequent calls to the apis.                                                                                                                                                     |
| `fetchTimeout` | This read/write property stores a timeout in milliseconds for [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) invocations. The default value is `1500`. If the value is `INFINITE_TIMEOUT`, `fetch()` will wait infinitely. |
| `files`        | This read-only property stores the [`Files`](#files) instance.                                                                                                                                                                                  |
| `permissions`  | This read-only property stores the [`Permissions`](#permissions) instance.                                                                                                                                                                      |

### <a id="permissions"></a>[Permissions](#c_permissions)

This class handles file [permissions](https://developers.google.com/drive/api/v3/reference/permissions).

| Name       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create()` | [Creates](https://developers.google.com/drive/api/v3/reference/permissions/create) a permission.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`requestBody:` [request body](https://developers.google.com/drive/api/reference/rest/v3/permissions#Permission)</li><li>`queryParameters?:` [query parameters](https://developers.google.com/drive/api/reference/rest/v3/permissions/create#query-parameters)</li></ul>Returns:<ul style="list-style-type:none;">[permission resource](https://developers.google.com/drive/api/reference/rest/v3/permissions#Permission)<li> |
| `delete()` | [Deletes](https://developers.google.com/drive/api/v3/reference/permissions/delete) a permission.<br><br>Parameters:<ul><li>`fileId: string`</li><li>`permissionId: string`</li><li>`queryParameters?:` [query parameters](https://developers.google.com/drive/api/reference/rest/v3/permissions/delete#query-parameters)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<void>`</li></ul>                                                                                                                                                                        |

## <a id="usage_uploaders"></a>[Uploaders](#c_usage_uploaders)

1. <a id="c_metadata_only_uploader"></a>[MetadataOnlyUploader](#metadata_only_uploader)
1. <a id="c_multipart_uploader"></a>[MultipartUploader](#multipart_uploader)
1. <a id="c_resumable_uploader"></a>[ResumableUploader](#resumable_uploader)
1. <a id="c_simple_uploader"></a>[SimpleUploader](#simple_uploader)
1. <a id="c_uploader"></a>[Uploader](#uploader)
1. <a id="c_uploader_with_data_mime_type"></a>[UploaderWithDataMimeType](#uploader_with_data_mime_type)
1. <a id="c_uploader_with_simple_data"></a>[UploaderWithSimpleData](#uploader_with_simple_data)

### <a id="metadata_only_uploader"></a>[MetadataOnlyUploader](#c_metadata_only_uploader)

An [`Uploader`](#uploader) descendant, this class handles [metadata-only](#files_new_metadata_only_uploader) uploads. It doesn't have own methods or properties. [`ExecuteResultType`](#execute_result_type) is set to [file resource](https://developers.google.com/drive/api/v3/reference/files#resource).

### <a id="multipart_uploader"></a>[MultipartUploader](#c_multipart_uploader)

An [`UploaderWithSimpleData`](#uploader_with_simple_data) descendant, this class handles [multipart](#files_new_multipart_uploader) uploads. [`ExecuteResultType`](#execute_result_type) is set to [file resource](https://developers.google.com/drive/api/v3/reference/files#resource).

| Name                     | Description                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setIsBase64()`          | Conditionally adds header `Content-Transfer-Encoding: base64` to the request.<br><br>Parameters:<ul><li>`isBase64: boolean`</li></ul>Description:<ul style="list-style-type:none;"><li>This method should be invoked with `isBase64` set to `true` if the data set with [`setData()`](#uploader_with_simple_data_set_data) is in Base64.</li></ul>Returns:<ul style="list-style-type:none;"><li>`this`</li><ul> |
| `setMultipartBoundary()` | Sets the boundary string to be used for this upload. The default is `foo_bar_baz`.<br><br>Parameters:<ul><li>`multipartBoundary: string`</li></ul>Returns:<ul style="list-style-type:none;"><li>`this`</li></ul>                                                                                                                                                                                                |

### <a id="resumable_uploader"></a>[ResumableUploader](#c_resumable_uploader)

An [`UploaderWithDataMimeType`](#uploader_with_data_mime_type) descendant, this class handles [resumable](#files_new_resumable_uploader) uploads. [`ExecuteResultType`](#execute_result_type) is set to [`ResumableUploadRequest`](#resumable_upload_request).

| Name                                                                   | Description                                                                                                                                                                                                                                                        |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="resumable_uploader_set_content_length"></a>`setContentLength()` | Can be invoked to set the content length if it's known beforehand.<br><br>Parameters:<ul><li>`contentLength: number`</li></ul>Returns:<ul style="list-style-type:none;"><li>`this`</li></ul>                                                                       |
| `setShouldUseMultipleRequests()`                                       | Specifies whether multiple requests will be used to upload the data. The default behaviour is not to use multiple requests.<br><br>Parameters:<ul><li>`shouldUseMultipleRequests: boolean`</li></ul>Returns:<ul style="list-style-type:none;"><li>`this`</li></ul> |

### <a id="simple_uploader"></a>[SimpleUploader](#c_simple_uploader)

An [`UploaderWithSimpleData`](#uploader_with_simple_data) descendant, this class handles [simple](#files_new_simple_uploader) uploads. It doesn't have own methods or properties. [`ExecuteResultType`](#execute_result_type) is set to [file resource](https://developers.google.com/drive/api/v3/reference/files#resource).

### <a id="uploader"></a>[Uploader](#c_uploader)

Descendants of this abstract class handle [create](https://developers.google.com/drive/api/v3/reference/files/create) and [update](https://developers.google.com/drive/api/v3/reference/files/update) requests.

`Uploader` has one template parameter, <a id="execute_result_type"></a>`ExecuteResultType`, set by descendants.

| Name                                     | Description                                                                                                                                                                                                                                                                                                                                     |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="uploader_execute"></a>`execute()` | Executes the request.<br><br>Returns:<ul style="list-style-type:none;"><li>`Promise<`[`ExecuteResultType>`](#execute_result_type)</li></ul>                                                                                                                                                                                                     |
| `setIdOfFileToUpdate()`                  | Sets the id of a [file resource](https://developers.google.com/drive/api/v3/reference/files#resource) to be updated.<br><br>Parameters:<ul><li>`fileId: string`</li></ul>Returns:<ul style="list-style-type:none;"><li>`this`</li></ul>                                                                                                         |
| `setQueryParameters()`                   | Sets query parameters.<br><br>Parameters:<ul><li>`queryParameters:` query parameters ([create](https://developers.google.com/drive/api/v3/reference/files/create#parameters) or [update](https://developers.google.com/drive/api/v3/reference/files/update#parameters))</li></ul>Returns:<ul style="list-style-type:none;"><li>`this`</li></ul> |
| `setRequestBody()`                       | Sets the request body.<br><br>Parameters:<ul><li>`requestBody:` request body ([create](https://developers.google.com/drive/api/v3/reference/files/create#request-body) or [update](https://developers.google.com/drive/api/v3/reference/files/update#request-body))</li></ul>Returns:<ul style="list-style-type:none;"><li>`this`</li></ul>     |

### <a id="uploader_with_data_mime_type"></a>[UploaderWithDataMimeType](#c_uploader_with_data_mime_type)

This abstract descendant of [`Uploader`](#uploader) makes it possible to set the data mime type.

| Name                | Description                                                                                                                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `setDataMimeType()` | Sets the data mime type.<br><br>Parameters:<ul><li>`dataMimeType: string`</li></ul><br>`MIME_TYPES` can be used as an easy to use source of MIME constants:<br><br><pre>import { MIME_TYPES } from '@robinbobin/react-native-google-drive-api-wrapper'</pre> |

### <a id="uploader_with_simple_data"></a>[UploaderWithSimpleData](#c_uploader_with_simple_data)

This abstract descendant of [`UploaderWithDataMimeType`](#uploader_with_data_mime_type) makes it possible to set the data to be uploaded.

| Name                                                       | Description                                                                                                                                                             |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="uploader_with_simple_data_set_data"></a>`setData()` | Sets the data to be uploaded.<br><br>Parameters:<ul><li>`data:` [`TSimpleData`](#t_simple_data)</li></ul>Returns:<ul style="list-style-type:none;"><li>`this`</li></ul> |

## <a id="usage_other_entities"></a>[Other entities](#c_usage_other_entities)

1. <a id="c_fetch_response_error"></a>[FetchResponseError](#fetch_response_error)
1. <a id="c_i_create_if_not_exists_result_type"></a>[ICreateIfNotExistsResultType](#i_create_if_not_exists_result_type)
1. <a id ="c_i_files_copy_parameters"></a>[IFilesCopyParameters](#i_files_copy_parameters)
1. <a id="c_i_files_get_parameters"></a>[IFilesGetParameters](#i_files_get_parameters)
1. <a id="c_i_request_upload_status_result_type"></a>[IRequestUploadStatusResultType](#i_request_upload_status_result_type)
1. <a id="c_i_upload_chunk_result_type"></a>[IUploadChunkResultType](#i_upload_chunk_result_type)
1. <a id="c_list_query_builder"></a>[ListQueryBuilder](#list_query_builder)
1. <a id ="c_resumable_upload_request"></a>[ResumableUploadRequest](#resumable_upload_request)
1. <a id="c_t_about_get_query_parameters"></a>[TAboutGetQueryParameters](#t_about_get_query_parameters)
1. <a id ="c_t_blob_to_byte_array_result_type"></a>[TBlobToByteArrayResultType](#t_blob_to_byte_array_result_type)
1. <a id="c_t_simple_data"></a>[TSimpleData](#t_simple_data)
1. <a id="c_unexpected_file_count_error"></a>[UnexpectedFileCountError](#unexpected_file_count_error)

### <a id="fetch_response_error"></a>[FetchResponseError](#c_fetch_response_error)

An instance of this class is thrown when a [response](https://developer.mozilla.org/en-US/docs/Web/API/Response) to an api call is received, but its [`ok`](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok) property is `false`.

| Name       | Description                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| `json`     | This read-only property will contain a JSON object describing the error. It can be `null`.                              |
| `response` | This read-only property will contain the result of [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch). |

### <a id="i_create_if_not_exists_result_type"></a>[ICreateIfNotExistsResultType](#c_i_create_if_not_exists_result_type)

This interface describes the result type of [`Files.createIfNotExists()`](#files_create_if_not_exists).

| Name             | Description                                                                                                                                                                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `alreadyExisted` | Will be `true` if the file already existed before the method invocation, `false` otherwise.                                                                                                                                                                                        |
| `result`         | Will contain a [file resource](https://developers.google.com/drive/api/v3/reference/files#resource), describing the existing file, if `alreadyExisted` is `true`. It will contain the result of invoking [`Uploader.execute()`](#uploader_execute) if `alreadyExisted` is `false`. |

### <a id="i_files_copy_parameters"></a>[IFilesCopyParameters](#c_i_files_copy_parameters)

This interface describes the `parameters` type for [`Files.copy()`](#files_copy).

| Name               | Description                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `queryParameters?` | [query parameters](https://developers.google.com/drive/api/reference/rest/v3/files/copy#query-parameters) |
| `requestBody?`     | [file resource](https://developers.google.com/drive/api/v3/reference/files#resource)                      |

### <a id="i_files_get_parameters"></a>[IFilesGetParameters](#c_i_files_get_parameters)

This interface describes the `parameters` type for [`Files.get()`](#files_get) and the like.

| Name               | Description                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| `queryParameters?` | [query parameters](https://developers.google.com/drive/api/reference/rest/v3/files/get#query-parameters) |
| `range?`           | Data [range](#files_get_range) to get                                                                    |

### <a id="i_request_upload_status_result_type"></a>[IRequestUploadStatusResultType](#c_i_request_upload_status_result_type)

This interface describes the result type of [ResumableUploadRequest.requestUploadStatus()](#resumable_upload_request_upload_status).

| Name                                                                     | Description                                                   |
| ------------------------------------------------------------------------ | ------------------------------------------------------------- |
| <a id="i_request_upload_status_result_type_is_complete"></a>`isComplete` | Will be `true` if the upload is completed, `false` otherwise. |
| `transferredByteCount`                                                   | Will hold the number of bytes currently transferred.          |

### <a id="i_upload_chunk_result_type"></a>[IUploadChunkResultType](#c_i_upload_chunk_result_type)

Extending [IRequestUploadStatusResultType](#i_request_upload_status_result_type), this interface describes the result type of [ResumableUploadRequest.uploadChunk()](#resumable_upload_request_upload_chunk).

| Name    | Description                                                                                                                                                                                              |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `json?` | Will contain a [file resource](https://developers.google.com/drive/api/v3/reference/files#resource), describing the file, if [`isComplete`](#i_request_upload_status_result_type_is_complete) is `true`. |

### <a id="list_query_builder"></a>[ListQueryBuilder](#c_list_query_builder)

A helper class for building [`Files.list()`](#files_list) [queries](https://developers.google.com/drive/api/guides/search-files). It uses the following type aliases:

    type TKey = string
    type TValue = JsonValue
    type TValueQuotationFlag = boolean

    type TKeyValueOperator = 'contains' | '=' | '>' | '<'
    type TValueKeyOperator = 'in'

    type TClause =
      | [TKey, TKeyValueOperator, TValue, TValueQuotationFlag?]
      | [TValue, TValueKeyOperator, TKey, TValueQuotationFlag?]

- `JsonValue` matches any valid JSON value.
- `TValueQuotationFlag` determines whether string values will be quoted. The default is `true`, meaning they will be quoted.

| Name            | Description                                                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `constructor()` | Parameters:<ul><li>`...clause: TClause`</li></ul>                                                                                                                  |
| `and()`         | Joins two subqueries with `and`.<br><br>Parameters:<ul><li>`...clause: TClause` _optional_</li></ul>Returns:<ul style="list-style-type:none;"><li>`this`</li></ul> |
| `or()`          | Joins two subqueries with `or`.<br><br>Parameters:<ul><li>`...clause: TClause` _optional_</li></ul>Returns:<ul style="list-style-type:none;"><li>`this`</li></ul>  |
| `pop()`         | Adds `)`.<br><br>Returns:<ul style="list-style-type:none;"><li>`this`</li></ul>                                                                                    |
| `push()`        | Adds `(`.<br><br>Parameters:<ul><li>`...clause: TClause` _optional_</li></ul>Returns:<ul style="list-style-type:none;"><li>`this`</li></ul>                        |
| `toString()`    | Stringifies the query.<br><br>Returns:<ul style="list-style-type:none;"><li>`string`</li></ul>                                                                     |

### <a id="resumable_upload_request"></a>[ResumableUploadRequest](#c_resumable_upload_request)

This class serves as [`ExecuteResultType`](#execute_result_type) for [`ResumableUploader`](#resumable_uploader).

| Name                                                                       | Description                                                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="resumable_upload_request_upload_status"></a>`requestUploadStatus()` | Requests the current upload status.<br><br>Returns:<ul style="list-style-type:none;"><li>`Promise<`[`IRequestUploadStatusResultType`](#i_request_upload_status_result_type)`>`</li></ul>                                                                                             |
| `setContentLength()`                                                       | Must be invoked when the content length is determined, if [`ResumableUploader.setContentLength()`](#resumable_uploader_set_content_length) wasn't invoked.<br><br>Parameters:<ul><li>`contentLength: number`</li></ul>Returns:<ul style="list-style-type:none;"><li>`this`</li></ul> |
| `transferredByteCount`                                                     | This read-only property will contain the current transferred byte count.                                                                                                                                                                                                             |
| <a id="resumable_upload_request_upload_chunk"></a>`uploadChunk()`          | Uploads a chunk of data.<br><br>Parameters:<ul><li>`chunk:` [`TSimpleData`](#t_simple_data)</li></ul>Returns:<ul style="list-style-type:none;"><li>`Promise<`[`IUploadChunkResultType`](#i_upload_chunk_result_type)`>`</li></ul>                                                    |

### <a id="t_about_get_query_parameters"></a>[TAboutGetQueryParameters](#c_t_about_get_query_parameters)

This type alias describes the `queryParameters` type for [`About.get()`](#about_get):

    type TAboutGetQueryParameters = IStandardParameters | string | string[]

, where `IStandardParameters` are defined as [here](https://cloud.google.com/apis/docs/system-parameters) and `string` or `string[]` determines the value of `fields`.

### <a id="t_blob_to_byte_array_result_type"></a>[TBlobToByteArrayResultType](#c_t_blob_to_byte_array_result_type)

This type alias describes the type of binary data returned from different api methods.

    type TBlobToByteArrayResultType = Uint8Array | null

### <a id="t_simple_data"></a>[TSimpleData](#c_t_simple_data)

This type alias describes the type of data for [`uploaders`](#usage_uploaders):

    Uint8Array | string | number[]

### <a id="unexpected_file_count_error"></a>[UnexpectedFileCountError](#c_unexpected_file_count_error)

An instance of this class is thrown by [`Files.createIfNotExists()`](#files_create_if_not_exists) if the number of matching files is not zero or one.

| Name        | Description                                |
| ----------- | ------------------------------------------ |
| `realCount` | Will contain the number of matching files. |
