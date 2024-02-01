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
3. Bind the component to a HTML element, by invoking the k1scanservice.  
(The .k1scanservice method will add an onClick event which will initialize and display the webtwain interface when the DOM component is clicked).
```javascript
$(function () {
    $('#scanbtn').k1scanservice({
        onComplete: K1ScanServiceComplete,
        viewButton: $("#viewBtn"),
        fileUploadURL: "",
        fileUploadHeaders: [{ key: "", value: "" }],
        clientID: 0,
        setupFile: "",
        licenseFile: "",
        interfacePath: "",
    });
});

function K1ScanServiceComplete(OnCompleteData) {
    console.log(OnCompleteData);
}
```

### Component Properties

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
