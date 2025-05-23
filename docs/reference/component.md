## Adding the WebTWAIN component to your project

- [Pre-requisites](#pre-requisites)
- [Steps](#steps)
- [Component Properties](#component-properties)
    - [onComplete](#oncomplete)
    - [viewButton](#viewbutton)
    - [fileUploadURL](#fileuploadurl)
    - [fileUploadHeaders](#fileUploadHeaders)
    - [clientID](#clientid)
    - [setupFile](#setupfile)
    - [licenseFile](#licenseFile)
    - [interfacePath](#interfacepath)
- [OnCompleteData](#oncompletedata)

### Pre-requisites
- [jQuery 3](https://jquery.com/)
- [WebTwain Service](https://webtwainsdk.com/demo-request/) is required to run this demo. Please acquire a copy from the demo website by clicking <b>Scan </b> to download and install the required service.

### Steps

1. Copy the [lib](https://github.com/Knowledgeone-Corporation/web-twain-sample/tree/master/wwwroot/lib) directory to your project.
2. Add the following references to your HTML DOM project.
```html
<script src="~/lib/k1scanservice/js/k1ss.js" type="module" asp-append-version="true"></script>
<link rel="stylesheet" href="~/lib/k1scanservice/css/k1ss.min.css" />
```
3. Invoke **K1WebTwain.Configure** to instantiate the service.
```javascript
var configuration = {
    onComplete: K1ScanServiceComplete,
    viewButton: $(".k1ViewBtn"),
    scanButton: $("#scanbtn"),
    fileUploadURL: "",
    fileUploadHeaders: [{ key: "", value: "" }],
    clientID: 0,
    setupFile: "",
    licenseFile: "",
    interfacePath: "", 
    scannerInterface: K1WebTwain.Options.ScannerInterface.Visible,
};

K1WebTwain.Configure(configuration)
    .then(function(response){
        ...
    })
    .catch(function(err){
        ...
    });
```

Note that in some circumstances it may be necessary to include a reset to clear certain errors in the Webtwain service at the time of the configure. Do this as follows
```javascript
K1WebTwain.Configure(configuration)
    .then(function(response){
        ...
        K1WebTwain.ResetService();
    })
    .catch(function(err){
        ...
        K1WebTwain.ResetService();
    })
```
This is only required for Windows version of WebTwain Scanner Service where scanners may initially appear but are subsequently unavailable. The call is supported on MacOS but performs no function on that platform.

4. Please follow the steps outlined by the selected **scannerInterface** value. If a value is not provided it will default to **K1WebTwain.Options.ScannerInterface.Visible**
#### K1WebTwain.Options.ScannerInterface.Hidden
1. Invoke **K1WebTwain.GetDevices** to get a list of available devices.
```javascript
K1WebTwain.GetDevices()
    .then(function(devices){
        ...
    })
    .catch(function(err){
        ...
    });
```
2. Invoke **K1WebTwain.Device** with the id of selected device from the list of available devices to get the device and and its capabilities.
```javascript
K1WebTwain.Device(deviceId)
    .then(function(deviceInfo){
        ...
    })
    .catch(function(err){
        ...
    });
```
3. Invoke **K1WebTwain.StartScan** to start scan the document's page(s) with the provided request.
```javascript
var request = {
    deviceId: 0,
    resolutionId: 0,
    pixelTypeId: 0,
    pageSizeId: 0,
    documentSourceId: 0,
    duplexId: 0
};

K1WebTwain.StartScan(request)
    .then(function(response){
        ...
    })
    .catch(function(err){
        ...
    });
```

3.1. Optional - Invoke **K1WebTwain.ClearAllScannedPages** to clear all scanned pages before scanning again.
```javascript
K1WebTwain.ClearAllScannedPages()
    .then(function () {
        // 
        ...
    })
    .catch(function (error) {
        // Handle the errors
        ...
    });
```

4. Invoke **K1WebTwain.GenerateDocument** to generate a document with the provided request.
```javascript
var request = {
    filetype: K1WebTwain.Options.OutputFiletype.PDF,
    ocrType: K1WebTwain.Options.OcrType.None,
    filename: "test",
    saveToType: K1WebTwain.Options.SaveToType.Upload
};

K1WebTwain.GenerateDocument(request)
    .then(function(response){
        ...
    })
    .catch(function(err){
        ...
    });
```

4.1. Optional - Invoke **K1WebTwain.ValidatePageSize** to pre-validate page(s) size and the to-be-generated PDF size for OCR processing.
```javascript
var request = {
    filetype: K1WebTwain.Options.OutputFiletype.PDF,
    ocrType: K1WebTwain.Options.OcrType.None,
    saveToType: K1WebTwain.Options.SaveToType.Upload,
    generateDocument: function () {
        GenerateDocument(K1WebTwain.Options.SaveToType.Upload)
    }
};

K1WebTwain.ValidatePageSize(request);
```

#### K1WebTwain.Options.ScannerInterface.Desktop
1. Invoke **K1WebTwain.GetDevices** to get a list of available devices.
```javascript
K1WebTwain.GetDevices()
    .then(function(devices){
        ...
    })
    .catch(function(err){
        ...
    });
```
2. Invoke **K1WebTwain.StartScan** to start scan the document's page(s) with the provided request.
```javascript
var request = {
    deviceId: 0
};

K1WebTwain.StartScan(request)
    .then(function(response){
        ...
    })
    .catch(function(err){
        ...
    });
```

2.1. Optional - Invoke **K1WebTwain.ClearAllScannedPages** to clear all scanned pages before scanning again.
```javascript
K1WebTwain.ClearAllScannedPages()
    .then(function () {
        // 
        ...
    })
    .catch(function (error) {
        // Handle the errors
        ...
    });
```

3. Invoke **K1WebTwain.GenerateDocument** to generate a document with the provided request.
```javascript
var request = {
    filetype: K1WebTwain.Options.OutputFiletype.PDF,
    ocrType: K1WebTwain.Options.OcrType.None,
    filename: "test",
    saveToType: K1WebTwain.Options.SaveToType.Upload
};

K1WebTwain.GenerateDocument(request)
    .then(function(response){
        ...
    })
    .catch(function(err){
        ...
    });
```

3.1. Optional - Invoke **K1WebTwain.ValidatePageSize** to pre-validate page(s) size and the to-be-generated PDF size for OCR processing.
```javascript
var request = {
    filetype: K1WebTwain.Options.OutputFiletype.PDF,
    ocrType: K1WebTwain.Options.OcrType.None,
    saveToType: K1WebTwain.Options.SaveToType.Upload,
    generateDocument: function () {
        GenerateDocument(K1WebTwain.Options.SaveToType.Upload)
    }
};

K1WebTwain.ValidatePageSize(request);
```
#### K1WebTwain.Options.ScannerInterface.Visible
- No additional actions are needed. The modal will be shown when the supplied scanButton is clicked.
#### K1WebTwain.Options.ScannerInterface.Web
- No additional actions are needed. The modal will be shown when the supplied scanButton is clicked.
  
### Configuration Properties

#### onComplete
**type:** function  
**required:** true  
**description:** Callback invoked after the "Attach Document" button has been clicked.  
**example:** 
> K1ScanServiceComplete

#### viewButton
**type:** HTML element  
**required:** false  
**description:** Adds an onClick event to the element. This event fires a GetDocument HTTPRequest  
**example:**  
> $("#viewBtn")

#### scanButton
**type:** HTML element  
**required:** false  
**description:** Adds an onClick event to the element. This event launches the scanner modal.  
**example:**  
> $("#scanBtn")

#### fileUploadURL
**type:** object  
**required:** true  
**description:** Route where the file will be sent to via HttpRequest.  
**example:**  
> document.location.origin + '/Home/UploadFile' [Sample Route](https://github.com/Knowledgeone-Corporation/web-twain-sample/blob/687796d778b0bdb633b1e2614508c4bd6ccbdf4b/Controllers/HomeController.cs#L62)

#### fileUploadHeaders
**type:** Array of objects(key-value pairs)
**required:** false  
**description:**  Additional headers for the request to the upload server when uploading document.  
**example:**''
> [
    {
>     key: "X-Access-Token",
      value: "Test"
    }
]

#### clientID
**type:** integer  
**required:** true  
**description:** Unique identifier for the session.  
**example:**  
> 1234567890

#### setupFile
**type:** string  
**required:** true  
**description:** Route which returns the service installer.  
**example:** 
> document.location.origin + '/Home/DownloadSetup' [Sample Route](https://github.com/Knowledgeone-Corporation/web-twain-sample/blob/687796d778b0bdb633b1e2614508c4bd6ccbdf4b/Controllers/HomeController.cs#L103)

#### licenseFile
**type:** string  
**required:** true  
**description:** Route which returns the license file.  
**example:** 
> document.location.origin + '/Home/K1Licence' [Sample Route](https://github.com/Knowledgeone-Corporation/web-twain-sample/blob/687796d778b0bdb633b1e2614508c4bd6ccbdf4b/Controllers/HomeController.cs#L116)

#### interfacePath
**type:** string  
**required:** false  
**description:** Override the path of the [scanner interface](https://github.com/Knowledgeone-Corporation/web-twain-sample/blob/master/wwwroot/lib/k1scanservice/content/interface.html)  
*Please note: The default path is set to "\{document.location.origin}/lib/k1scanservice/content/interface.html"*  
**example:**  
> http://localhost/lib/k1scanservice/content/interface.html

#### scannerInterface
**type:** K1WebTwain.Options.ScannerInterface  
**required:** false  
**description:** Sets the type of interface used to interact with the image aquisition device.  
*Please note: This will default to K1WebTwain.Options.ScannerInterface.Visible if not set*  
**example:**  
> K1WebTwain.Options.ScannerInterface.None

### Schemas

#### OnCompleteData
**type:** object  
**description:** an object containing data about the generated file.  
**example:**  
```javascript
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
