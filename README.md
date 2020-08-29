This wrapper facilitates the use of the [google drive api](https://developers.google.com/drive/v3/reference/).

It doesn't provide any authorization mechanism, so another package has to be used. I use [react-native-google-signin](https://www.npmjs.com/package/react-native-google-signin) (thanks for the great work guys!).

 1. <a name="cinstallation"></a>[Installation](#installation)
 2. <a name="cusage"></a>[Usage](#usage)
 3. <a name="cversionHistory"></a>[Version history](#versionHistory)

### <a name="installation"></a>[Installation](#cinstallation)

    npm i --save react-native-google-drive-api-wrapper
    
    react-native link react-native-fs

[react-native-fs](https://www.npmjs.com/package/react-native-fs) is a package my code depends on and it needs linking.

### <a name="usage"></a>[Usage](#cusage)

 1. <a name="cgdriveapiwGDrive">[GDrive](#gdriveapiwGDrive)</a>
 1. <a name="cgdriveapiwFiles">[Files](#gdriveapiwFiles)</a>
 1. <a name="cgdriveapiwPermissions">[Permissions](#gdriveapiwPermissions)</a>
 1. <a name="cgdriveapiwAbout">[About](#gdriveapiwAbout)</a>

#### <a name="gdriveapiwGDrive">[GDrive<i class="icon-up"></i>](#cgdriveapiwGDrive)</a>
This is the "entry point" of the wrapper. It contains only `static` methods and fields.

    import GDrive from "react-native-google-drive-api-wrapper";

 - [setAccessToken()<i class="icon-up"></i>](#gdriveapiwGDrive)
    
    Sets the access token for use in subsequent calls to the api. Get the token from a package you choose to use.
    
        GDrive.setAccessToken(accessToken);
    
 - [init()<i class="icon-up"></i>](#gdriveapiwGDrive)
    
    Initializes the wrapper.
    
        GDrive.init();
    
    or
    
	    const params = {
	        files: {
		        boundary: String // The boundary string for multipart file uploads. Default: "foo_bar_baz".
	        }
	    };
        
        GDrive.init(params);
    
 - [isInitialized()<i class="icon-up"></i>](#gdriveapiwGDrive)
    
    Returns `true` if an access token has been supplied, `false` otherwise.
    
        GDrive.isInitialized() ? <some code> : <some other code>;

#### <a name="gdriveapiwFiles">[Files<i class="icon-up"></i>](#cgdriveapiwFiles)</a>

 - [createFileMultipart()<i class="icon-up"></i>](#gdriveapiwFiles)
    
    Creates a file using [multipart upload](https://developers.google.com/drive/v3/web/manage-uploads). Returns the result of `fetch()`.
    If `contents` is a base64 string, set `isBase64` to `true`.
    
        const contents = "My text file contents";
        // or
        const contents = [10, 20, 30];
        
        GDrive.files.createFileMultipart(
            contents,
            "corresponding mime type", {
	            parents: ["root"],
	            name: "My file"
            },
            isBase64);
            
 - [delete()<i class="icon-up"></i>](#gdriveapiwFiles)
    
    [Deletes](https://developers.google.com/drive/v3/reference/files/delete) the specified file returning the result of `fetch()`.
    
	    GDrive.files.delete(fileId);

 - [get()<i class="icon-up"></i>](#gdriveapiwFiles)
	
    Gets a file's metadata or a text-file's content by ID. By default the metadata is returned. Use `download()` for binary files. For `queryParams` see "Optional query parameters" [here](https://developers.google.com/drive/v3/reference/files/get). If you want the content of a text-file and not its metadata add `alt: "media"` to `queryParams`.
	
		const queryParams = { ... };
		GDrive.files.get(fileId, queryParams);
		
 - [download()<i class="icon-up"></i>](#gdriveapiwFiles)
	
	Downloads the specified text or binary file.
	
	For `downloadFileOptions` see the description of`downloadFile()` [here](https://www.npmjs.com/package/react-native-fs). Please, bear in mind that `fromUrl` is set automatically and any user supplied value will be overwritten.
	
	The meaning of `queryParams` is the same as in `get()`.
	
	The function returns the result of `RNFS.downloadFile(downloadFileOptions)`.
		
		GDrive.files.download(fileId, downloadFileOptions, queryParams);

 - [export()](#gdriveapiwFiles)

	[Exports](#https://developers.google.com/drive/v3/reference/files/export) a google document, returning the result of `fetch()`.

	    GDrive.files.export(fileId, mimeType);

 - [getId()<i class="icon-up"></i>](#gdriveapiwFiles)
    
	Gets the id of the first file with the specified metadata. The function returns a `Promise`. It's rejected on failure and resolved to the file id or `undefined` (if nothing is found) on success.
	
        GDrive.files.getId(
            name: String, // The name.
            parents: [String], // The parents.
            mimeType: String, // The mime type.
            trashed: Boolean // Whether the file is trashed. Default: false
        );
		
 - [list()<i class="icon-up"></i>](#gdriveapiwFiles)
	
	[Lists or searches files](https://developers.google.com/drive/v3/reference/files/list) returning the result of `fetch()`.
	
		GDrive.files.list({q: "'root' in parents"});
		
 - [update()<i class="icon-up"></i>](#gdriveapiwFiles)
	
	[Updates](https://developers.google.com/drive/api/v3/reference/files/update) a file's metadata. returning the result of `fetch()`.
	
		GDrive.files.update("file_id", {
		    removeParents: "o_parent_id",
		    addParents: "parent_id",
		    resource: {
			modifiedTime: new Date(Date.now()).toISOString(),
		    },
		})

	
 - [safeCreateFolder()<i class="icon-up"></i>](#gdriveapiwFiles)
	
	Gets the id of the first folder with the specified `name` and `parents`, creating the folder if it doesn't exist. The function returns a `Promise` that is rejected on failure and resolved to the folder id on success.
	
        GDrive.files.safeCreateFolder({
            name: "My folder",
            parents: ["root"]
        });

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
