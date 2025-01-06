## Knowledgeone WebTWAIN Release Notes

## Version 3.0.0
- Introduces stability fixes and performance enhancements for both Windows and MacOS.
- Logging now provides more detailed and actionable information for troubleshooting across Windows and MacOS.
- UI/UX improvements for modifications and long-running operations.
- Added validations and implemented security improvements.
- **Barcode Recognition**: Supports recognition of modern barcode types on documents.
- **Form Processing**: Extracts data from documents based on designed templates.
- **Template Designer**: Added for Barcode Recognition and Form Processing features.
- Enables adding or importing document types such as PDF, PDF/A, TIFF, TIF, JPG, JPEG, PNG, BMP, and GIF, treating them as or resembling scanned documents.
- Support for manual and automatic de-skewing to align skewed documents.
- Option to return a compressed ZIP file containing multiple images in formats such as PNG, JPEG, BMP, and GIF.

### Version 2.3.3
- This release introduces stability fixes for both Windows and MacOS.
- Enhanced issue troubleshooting with more concise logging messages and additional tracing information.
- UI and UX enhancements for modifying, finalizing and generating documents.
- Enhanced resizing function with real-time progress tracking, better error handling, and error reporting.
- Updated OCR process with pre-validation of page sizes and the final PDF size.
- Additional updates to the OCR process, including the ability to cancel long-running OCR tasks, better error handling, and graceful exiting.
- Performance enhancements for processing, modifying, and generating documents that containing large/complex pages.

### Version 2.3.2
- Improves logging with useful information for troubleshooting issues on both Windows and MacOS
- Displays the version and product information of Knowledgeone WebTWAIN SDK service on the UI (for Web and Visible modes)
- Verify the available scanner resolutions to ensure suitability for scanning 
- Update the version-checking function with the correct checking message and post-checking action

### Version 2.3.1
- This release introduces stability fixes for both Windows and MacOS
- UI and UX enhancements for the initializing and scanning process
- Improved handling of disconnected/unavailable scanners
- Supports the restoring for all modified pages and enhances the current restoring function for single-page

### Version 2.3.0
- This release introduces stability fixes for both Windows and MacOS
- Supports secure messaging for browsers that enforce HTTPS requests on Windows
- Supports additional header(s) when uploading scanned page(s)
- Support resizing function for the scanned page(s)
- New mechanism to manage and distribute the license among sites
- Support options to save the processed documents locally or upload them to configured endpoints

### Version 2.2.0
- This release introduces many stability fixes for both Windows and Mac OS
- Supports the Sourceforge Virtual scanner
- Handle skip empty page setting for scanners
- Supports secure messaging for Safaris on Mac OS
- Auto restart in case of crashed service
- Check document feeder prior to scan for compatible scanners
- Greatly expanded logging capabilities for both the service and the native scanner app
- Comprehensive error messaging, ensuring that error messages get reported to the web page
- Improved handling of large images 
- Optional command to reset the windows service 
- More intuitive flow for demo website

### Version 2.1.0
- This release brings feature parity for macOS. 
- Updated to use the loopback address instead of localhost. [Private network access update](https://developer.chrome.com/blog/private-network-access-update/)

#### Service
- AttachDocument has been updated to POST.
- Updated device model. Device features now appear under the documentSourceId.  
This corrects an issue for combo-scanners where certain features are not present in a given source.

``` json
{
	"0": {
		"id": 1,
		"name": "CanoScan LiDE 110",
		"isDefault": true,
		"documentSourceIds": {
			"0": {
				"name": "Flatbed",
				"id": 0,
				"resolutionIds": {
					"50": "75",
					"75": "100",
				},
				"pixelTypeIds": {
					"0": "BW",
					"1": "Gray",
					"2": "RGB"
				},
				"pageSizeIds": {
					"1": "A4",
					"2": "JISB5",
				},
				"duplexIds": {}
			}
		}
	}
}
```

#### Issues fixed in this release
- DuplexIds returned an empty collection when the feature was present on the scanner device.
- Error messages when invoking acquire were sometimes not being returned.

### Version 2.0.0

#### Component
- Added **scannerInterface** to the configuration.
  - **None:** hides both UI elements. Allows for scanning and document creating with a single click.
  - **Web:** hides the desktop UI. Allows for specifying the scan parameters in the scanning modal.
  - **Visible:** displays both the desktop UI and the scanning modal.
  - **Desktop:** hides the web modal. Displays the desktop UI to set the scan parameters.
- Removed **version** from the configuration.
- Added **scanButton** to the configuration to bind an onclick event to the specified HtmlElement to display the modal.
- Added **K1WebTwain** namespace object. Provides methods to interact with the service via JavaScript.

#### Windows Service
- Updated to Tesseract4.
- Updated PDF/A generation.
- Added **ServiceAvailable** HttpGet.
- Updated **StartScan** to have additional validation.
- Updated **AttachDocument** to have additional validation.

#### Issues fixed in this release
- **\[Component]** Fixed a rare issue where a failed scan could leave the waiting modal indefinitely visible.
- **\[Component]** Fixed an issue where upgrading could cause an error message to appear.

#### Known Issues
- Using WIA the scan parameters are limited when using [None | Web]. Please use the TWAIN driver or use [Visible | Desktop].
- **scannerInterface** selection is limited to [Visible] on macOS. This will be addressed in a future release.
