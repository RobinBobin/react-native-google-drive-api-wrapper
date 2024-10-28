1. Create chunks in multiples of 256 KB (256 x 1024 bytes) in size
1. `execute()` sends the initial chunk.
1. ResumableUploader.ts - line 114 - what if [] / string is empty?
1. `uploadChunk()` - `setContentLength()`- upload much more - consider this case.
1. `setContentLength()` - throw if already sent.
