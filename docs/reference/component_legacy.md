## Adding the WebTWAIN component to your project

- [Pre-requisites](#pre-requisites)
- [Steps](#steps)
- [Component Properties](#component-properties)
    - [onComplete](#oncomplete)
    - [viewButton](#viewbutton)
    - [fileUploadURL](#fileuploadurl)
    - [clientID](#clientid)
    - [setupFile](#setupfile)
    - [version](#version)
    - [interfacePath](#interfacepath)
- [OnCompleteData](#oncompletedata)

### Pre-requisites
- [jQuery 3](https://jquery.com/)
- [WebTwain Service](https://webtwainsdk.com/demo-request/) is required to run this demo. Please acquire a copy from the demo website by clicking <b>Scan </b> to dowload and install the required service.

### Steps

1. Copy the [lib](https://github.com/Knowledgeone-Corporation/web-twain-sample/tree/master/wwwroot/lib) directory to your project.
2. Add the following references to your HTML DOM project.
```html
<script src="~/lib/k1scanservice/js/k1ss_obfuscated.js" type="module" asp-append-version="true"></script>
<link rel="stylesheet" href="~/lib/k1scanservice/css/k1ss.min.css" />
```
3. Bind the component to a HTML element, by invoking the k1scanservice.  
(The .k1scanservice method will add an onClick event which will initialise and display the webtwain interface when the DOM component is clicked).
```javascript
$(function () {
    $('#scanbtn').k1scanservice({
        onComplete: K1ScanServiceComplete,
        viewButton: $("#viewBtn"),
        fileUploadURL: "",
        clientID: 0,
        setupFile: "",
        version: "",
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
> document.location.origin + '/Home/UploadFile' [Sample Route](https://github.com/Knowledgeone-Corporation/web-twain-sample/blob/50b9f1cdcd9332528485034a3c26b888d374b160/Controllers/HomeController.cs#L65)

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
> document.location.origin + '/Home/DownloadSetup' [Sample Route](https://github.com/Knowledgeone-Corporation/web-twain-sample/blob/50b9f1cdcd9332528485034a3c26b888d374b160/Controllers/HomeController.cs#L91)

#### version
**type:** string  
**required:** false  
**description:** Override the service version. Update this to load a previous version.  
**example:**  
> 1.0.2

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
    uploadResponse : { } // response returned from the file upload route
}
```
