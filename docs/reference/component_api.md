# K1WebTwain Namespace
## Methods
#### K1WebTwain.Configure
**type:** promise  
**description:** instatiate the service. This method will echo back the request on success.  
**example:**  
```javascript
{
    var configuration = {
        onComplete: onComplete,
        viewButton: $("#viewBtn"),
        scanButton: $("#scanBtn"),
        fileUploadURL: "",
        clientID: 1232141123,
        setupFile: "",
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
    0:{
        documentSourceIds: {0: "Flatbed"},
        duplexIds: {},
        id: 1,
        isDefault: true,
        name: "CanoScan LiDE 110",
        pageSizeIds: {0: "None", 1: "A4", 2: "JISB5", 3: "USLetter"},
        pixelTypeIds: {0: "BW", 1: "Gray", 2: "RGB"},
        resolutionIds: {50: "75", 75: "100", 125: "150"},
    },
    1:{
        ...
    },
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
    documentSourceIds: {0: "Flatbed"},
    duplexIds: {},
    id: 1,
    isDefault: true,
    name: "CanoScan LiDE 110",
    pageSizeIds: {0: "None", 1: "A4", 2: "JISB5", 3: "USLetter"},
    pixelTypeIds: {0: "BW", 1: "Gray", 2: "RGB"},
    resolutionIds: {50: "75", 75: "100", 125: "150"},
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
```json
{
    filename: "abc", // output filename
    fileLength: 123, // file size in bytes
    sizeDisplay: "1.23 MB", // converted file size
    extension: ".pdf", // file type extension
    uploadResponse : { } // response returned from the file upload route
}
```
---

## Request Objects

#### ConfigurationRequest
**type:** object  
**description:** request object to set the K1WebTwain configuration.  
```json
{
    onComplete: function,
    viewButton: HTMLElement,
    scanButton: HTMLElement,
    fileUploadURL: string,
    clientID: integer,
    setupFile: string,
    interfacePath: string,
    scannerInterface: K1WebTwain.Options.ScannerInterface,
}
```

#### AcquireRequest
**type:** object  
**description:** request object to set the K1WebTwain acquisition.  
```json
{
    deviceId: integer,
    resolutionId: integer,
    pixelTypeId: integer,
    pageSizeId: integer,
    documentSourceId: integer,
    duplexId: integer,
    filetype: K1WebTwain.Options.OutputFiletype
    ocrType: K1WebTwain.Options.OcrType
    filename: string
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
Embedded - text is embeeded in the document.
```

#### K1WebTwain.Options.PagePlacement
**type:** enum  
**description:** set the positioning of the scanned pages.  
```
AfterCurrentPage - place the page after the current index in the document.
BeforeCurrentPage - place the page before to the current index in the document.
ReplaceCurrentPage - replace the current page in the document
```