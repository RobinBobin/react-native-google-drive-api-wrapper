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
      Files,
      GDrive,
      MimeTypes
    } from "@robinbobin/react-native-google-drive-api-wrapper";
    
    // = Somewhere in your code = //
    GoogleSignin.configure(...);
    await GoogleSignin.signIn();
    
    const gdrive = new GDrive();
    gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
    gdrive.files = new Files();
    
    await gdrive.files.list();
    
    const id = (await gdrive.files.newMultipartUploader()
      .setData([1, 2, 3, 4, 5], MimeTypes.BINARY)
      .setRequestBody({
        name: "multipart_bin"
      })
      .execute()
    ).id;
    
    await gdrive.files.getBinary(id);

<br>

1. <a name="c_gdrive"></a>[GDrive](#gdrive)
2. <a name="c_gdriveapi"></a>[GDriveApi](#gdriveapi)
3. <a name="c_http_error"></a>[HttpError](#http_error)
4. <a name="c_files"></a>[Files](#files)

#### <a name="gdrive"></a>[GDrive](#c_gdrive)

A `GDrive` instance stores your google sign-in token and the class instances you create to utilize the google drive api.

Name|Type|Description
-|-|-
accessToken|access token|The access token to be used in subsequent calls to the api. Get the token from a package you choose to use.
files|[`Files`](#files) instance|The class instance you create to manage [files](#https://developers.google.com/drive/api/v3/reference/files) in your google drive.
 | |

#### <a name="gdriveapi"></a>[GDriveApi](#c_gdriveapi)

The base class for the classes that wrap individual parts of the google drive api.

Name|Type|Description
-|-|-
<a name="gdriveapi_fetch_coerces_types"></a>fetchCoercesTypes|Boolean (read/write property)|If true, the data returned from a successful api call is converted to the json, text or byte (`Uint8Array`) type. If `false`, no conversion is performed and the result of [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is returned as is. The type, the data is coerced to, is specified in the documentation of each method, that utilizes this property. The default value is `true`.
<a name="gdriveapi_fetch_rejects_on_http_errors"></a>fetchRejectsOnHttpErrors|Boolean (read/write property)|If true, unsuccessful api calls throw an instance of [`HttpError`](#http_error). If `false`, the result of [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is returned as is. The default value is `true`.
 | |

#### <a name="http_error"></a>[HttpError](#c_http_error)

An instance of this class is thrown when an api call fails, if [fetchRejectsOnHttpErrors](#gdriveapi_fetch_rejects_on_http_errors) is `true` for that api. All the properties are read-only.

Name|Type|Description
-|-|-
json|Object|An object containing the error. Can be `undefined`.
response|Object|The result of [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
text|String|The error description obtained from the response.
 | |

#### <a name="files"></a>[Files](#c_files)

Extends [GDriveApi](#gdriveapi). The parameter `range` for the methods that accept it is specified as [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) with one exception:
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
getMetadata(fileId, queryParameters = {})|Method|Get's a file's metadata. Returns a [Files resource](https://developers.google.com/drive/api/v3/reference/files) if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
getText(fileId, queryParameters, range)|Method|Gets the content of a text file. Returns a string if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
list(queryParameters)|Method|[Lists](https://developers.google.com/drive/api/v3/reference/files/list) files. Returns an `Object` if the call succeeds and [fetchCoercesTypes](#gdriveapi_fetch_coerces_types) is `true`.
multipartBoundary|String (read/write property)|The boundary string to be used for multipart uploads. The default value is `"foo_bar_baz"`.
 | | 

<br><br><br><br><br><br>

#### <a name="gdriveapiwPermissions">[Permissions<i class="icon-up"></i>](#cgdriveapiwPermissions)</a>

 - [create()](#gdriveapiwPermissions)
	
	[Creates](https://developers.google.com/drive/v3/reference/permissions/create) a permission for the specified file returning the result of fetch().
	
        GDrive.permissions.create(
            fileId, {
                emailAddress: 'example@gmail.com',
                role: "reader",
                type: "anyone"
            }, {
                emailMessage: `I shared a file with you.`,
            });
	    
 - [delete()](#gdriveapiwPermissions)
	
	[Delete](https://developers.google.com/drive/api/v3/reference/permissions/delete) a permission returning the result of fetch().
	
        GDrive.permissions.delete("fileId", "permissionId");


#### <a name="gdriveapiwAbout">[About<i class="icon-up"></i>](#cgdriveapiwAbout)</a>

 - [get()](#gdriveapiwAbout)
	
	[Gets](https://developers.google.com/drive/api/v3/reference/about/get) information about the user, the user's Drive, and system capabilities returning the result of fetch().
	
        GDrive.about.get({
            fields: 'storageQuota'
        });

### <a name="versionHistory"></a>[Version history](#cversionHistory)

Version number|Changes
-|-
v1.2.0|`GDrive.files.createFileMultipart()` &mdash; `isBase64`. Merge pull request #10 from duyluonglc/master. Thanks, duyluonglc!
v1.1.1|`GDrive.files.export()` added.
v1.0.1|1.&nbsp;A critical bug with invalid imports fixed.<br>2.&nbsp;`client-side-common-utils` deprecated; switched to `simple-common-utils`.
v1.0.0|Initial release.

<br><br>
> Written with [StackEdit](https://stackedit.io/).
