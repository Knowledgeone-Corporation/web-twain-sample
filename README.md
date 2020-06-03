# Knowledgeone WebTWAIN
Provides a webservice interface for interacting with a TWAIN compatible scanner.

To run the demo either visit [https://demo.webtwainsdk.com/](https://demo.webtwainsdk.com/) or clone the repository and build the application locally.

## Getting Started

### Prerequisites
* .NET Core 3.1 Runtime (Required for the demo)
* .NET Framework 4.7.2 (Required for the scanning service)

### Installation
* Copy and add references to the lib folder to your project.
* Copy and add references to the site.js file to your project.
* Update the site.js settings:
  * __clientID__ : used to identify the current session.
  * __fileUploadURL__ : endpoint where the file will be posted to.
  * __onComplete__ : callback which will be invoked when the attach button has been clicked.
  * __setupFile__: endpoint where the service installer is located.
  * __viewButton*__ : adds and event handler to download the file on click.

\* These properties are optional.

To invoke the scanning modal either:
* Create an input with the id set to __scanbtn__ e.g. _\<input id='scanbtn' type='button' value='Scan'>_
* Modify site.js and set the __$('#scanbtn')__ selector to the id of your target element.


The onComplete callback will return the following object.

```
{
    FileName:string - The filename the user assigned to the document
    FileLength:number - The total size of the file in bytes
    SizeDisplay:string - The total size (as string – i.e. 12.1MB) of the final scanned document
    Extension:string - The file type of the file (i.e. JPG, PDF, etc)
}
```

## Licence
The generated file will have a watermark.

To purchase a licence please [contact us](https://webtwainsdk.com/contact-us/).
