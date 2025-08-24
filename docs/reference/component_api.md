# K1WebTwain Namespace
## Methods
#### K1WebTwain.Configure
**type:** promise  
**description:** instantiate the service. This method will echo back the request on success.  
**example:**  
```javascript
{
    var configuration = {
        onComplete: onComplete,
        viewButton: $("#viewBtn"),
        scanButton: $("#scanBtn"),
        fileUploadURL: "",
        fileUploadHeaders: [{ key: "", value: "" }],
        clientID: 1232141123,
        setupFile: "",
        licenseFile: "",
        interfacePath: "",
        scannerInterface: K1WebTwain.Options.ScannerInterface.Visible,
    };

    K1WebTwain.Configure(configuration)
        .then(function(response){
            // The request object is echoed in the response object.
            // The component is now ready.
            ...
        })
        .catch(function(error){
            // Handle the errors
            ...
        });
}
```
---

#### K1WebTwain.GetDevices
**type:** promise  
**description:** returns a dictionary of devices, keyed by index.  
**example:**  
```javascript
{
    K1WebTwain.GetDevices()
        .then(function(devices){
            // available devices on the users machine.
            ...
        })
        .catch(function(error){
            // Handle the errors
            ...
        });
}
```
##### GetDevices Response
**type:** object  
**description:** dictionary of devices, keyed by index.  
```json
{
   "2":{
      "id":2,
      "name":"Samsung SCX-4623 Series",
      "isDefault":true,
      "documentSourceIds":{}
   }
}
```
---

#### K1WebTwain.Device
**type:** object  
**description:** returns the device with the matching ID.  
**example:**  
```javascript
{
    var device = K1WebTwain.Device(id);
}
```
##### Device Response
**type:** object  
**description:** the device object  
```json
{
  "id": 2,
  "name": "Samsung SCX-4623 Series",
  "isDefault": true,
  "documentSourceIds": {
    "0": {
      "name": "Flatbed",
      "id": 0,
      "resolutionIds": {
        "0": "75",
        "1": "100",
        "2": "150"
      },
      "pixelTypeIds": {
        "0": "BW"
      },
      "pageSizeIds": {
        "0": "USLetter",
        "1": "USExecutive",
        "2": "USStatement"
      },
      "duplexIds": {}
    },
    "1": {
      "name": "Feeder",
      "id": 1,
      "resolutionIds": {
        "0": "75",
        "1": "100",
        "2": "150"
      },
      "pixelTypeIds": {
        "0": "BW"
      },
      "pageSizeIds": {
        "0": "USLetter",
        "1": "USLegal",
        "2": "USExecutive"
      },
      "duplexIds": {
        "8": "None"
      }
    }
  }
}
```
---

#### K1WebTwain.Acquire
**type:** promise  
**description:** instantiates a session with the selected image acquisition device and generates a document.  
**example:**  
```javascript
{
    var request = {
        deviceId: 1,
        resolutionId: 1,
        pixelTypeId: 1,
        pageSizeId: 1,
        documentSourceId: 0,
        duplexId: 0,
        filetype: K1WebTwain.Options.OutputFiletype.PDF,
        ocrType: K1WebTwain.Options.OcrType.None,
        filename: test,
        saveToType: K1WebTwain.Options.SaveToType.Upload,
        fileCompressionType: K1WebTwain.Options.FileCompressionType.None
    };

    K1WebTwain.Acquire(request)
        .then(function (response) {
            // 
            ...
        })
        .catch(function (error) {
            // Handle the errors
            ...
        });
}
```
##### Acquire Response
**type:** object  
**description:** details about the generated file  
```json5
{
    filename: "abc", // output filename
    fileLength: 123, // file size in bytes
    sizeDisplay: "1.23 MB", // converted file size
    extension: ".pdf", // file type extension
    hasOcrRequest: false, //indicates if there's an Ocr process in progress for a PDF-type document
    uploadResponse: { }, // response returned from the file upload route,
    saveToType: K1WebTwain.Options.SaveToType.Local // option to upload the processed file or save it locally
}
```
---

#### K1WebTwain.StartScan
**type:** promise  
**description:** instantiates a session with the selected image acquisition device and start scanning.  
**example:**  
```javascript
{
    var request = {
        deviceId: 1,
        resolutionId: 1,
        pixelTypeId: 1,
        pageSizeId: 1,
        documentSourceId: 0,
        duplexId: 0
    };

    K1WebTwain.StartScan(request)
        .then(function (response) {
            // 
            ...
        })
        .catch(function (error) {
            // Handle the errors
            ...
        });
}
```
##### StartScan Response
**type:** object  
**description:** details about the generated file  
```json5
{
    success: true, // scanning result
    pageCount: 10, // total number of scanned page(s)
}
```
---

#### K1WebTwain.GenerateDocument
**type:** promise  
**description:** generates a document from scanned (pages).  
**example:**  
```javascript
{
    var request = {
        filetype: K1WebTwain.Options.OutputFiletype.PDF,
        ocrType: K1WebTwain.Options.OcrType.None,
        filename: test,
        saveToType: K1WebTwain.Options.SaveToType.Upload,
        fileCompressionType: K1WebTwain.Options.FileCompressionType.None
    };

    K1WebTwain.GenerateDocument(request)
        .then(function (response) {
            // 
            ...
        })
        .catch(function (error) {
            // Handle the errors
            ...
        });
}
```
##### GenerateDocument Response
**type:** object  
**description:** details about the generated file  
```json5
{
    filename: "abc", // output filename
    fileLength: 123, // file size in bytes
    sizeDisplay: "1.23 MB", // converted file size
    extension: ".pdf", // file type extension
    hasOcrRequest: false, //indicates if there's an Ocr process in progress for a PDF-type document
    uploadResponse: { }, // response returned from the file upload route,
    saveToType: K1WebTwain.Options.SaveToType.Local // option to upload the processed file or save it locally
}
```
---

#### K1WebTwain.ValidatePageSize
**type:** promise  
**description:** pre-validate page(s) size and the to-be-generated PDF size for OCR processing.  
**example:**  
```javascript
{
    var request = {
        filetype: K1WebTwain.Options.OutputFiletype.PDF,
        ocrType: K1WebTwain.Options.OcrType.None,
        filename: test,
        saveToType: K1WebTwain.Options.SaveToType.Upload,
        fileCompressionType: K1WebTwain.Options.FileCompressionType.None
    };

    K1WebTwain.ValidatePageSize(request);
}
```
---

#### K1WebTwain.ClearAllScannedPages
**type:** promise  
**description:** clear all scanned page(s) before scanning again.  
**example:**  
```javascript
{
    K1WebTwain.ClearAllScannedPages()
        .then(function () {
            // 
            ...
        })
        .catch(function (error) {
            // Handle the errors
            ...
        });
}
```
---

## Request Objects

#### ConfigurationRequest
**type:** object  
**description:** request object to set the K1WebTwain configuration.  
```json5
{
    onComplete: function,
    viewButton: HTMLElement,
    scanButton: HTMLElement,
    fileUploadURL: string,
    fileUploadHeaders: [{ key: "", value: "" }],
    clientID: integer,
    setupFile: string,
    licenseFile: "",
    interfacePath: string,
    scannerInterface: K1WebTwain.Options.ScannerInterface,
}
```

#### AcquireRequest
**type:** object  
**description:** request object to set the K1WebTwain acquisition.  
```json5
{
    deviceId: integer,
    resolutionId: integer,
    pixelTypeId: integer,
    pageSizeId: integer,
    documentSourceId: integer,
    duplexId: integer,
    filetype: K1WebTwain.Options.OutputFiletype
    ocrType: K1WebTwain.Options.OcrType
    filename: string,
    saveToType: K1WebTwain.Options.SaveToType.Upload,
    fileCompressionType: K1WebTwain.Options.FileCompressionType.None
}
```

## Constants
### K1WebTwain.Options
#### K1WebTwain.Options.ScannerInterface
**type:** enum  
**description:** set the scanner interface.  
```
Hidden - no user interface is shown.  
Visible - displays the web modal and the image acquisition device's interface on the desktop.  
Web - displays the web modal only.  
Desktop - displays the image acquisition device's interface on the desktop.  
```

#### K1WebTwain.Options.OutputFiletype
**type:** enum  
**description:** set the generated document's filetype
```
PDF
PDF_A
TIFF
JPEG
GIF
BMP
PNG
```  

#### K1WebTwain.Options.OcrType
**type:** enum  
**description:** set the OCR mode used for PDF documents.  
```
None - no OCR processing is done.
Mapped - text is mapped to the location of the string.
Embedded - text is embedded in the document.
```

#### K1WebTwain.Options.PagePlacement
**type:** enum  
**description:** set the positioning of the scanned pages.  
```
AfterCurrentPage - place the page after the current index in the document.
BeforeCurrentPage - place the page before the current index in the document.
ReplaceCurrentPage - replace the current page in the document
```

#### K1WebTwain.Options.SaveToType
**type:** enum  
**description:** options to save the processed file locally or upload it to configured endpoint
```
Upload - Upload the file.
Local - Save the file locally.
```

#### K1WebTwain.Options.FileCompressionType
**type:** enum  
**description:** set the compression level for generated files.
```
 None - Produces the highest quality output with larger file size.  
 Low - Maintains visually good quality with balanced file size.  
 Medium - Applies noticeable compression while keeping quality acceptable for many use cases.  
 High - Applies heavy compression, resulting in smaller file sizes with visible artifacts.
```