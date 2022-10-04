## Knowledgeone WebTWAIN Release Notes

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
