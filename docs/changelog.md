## Knowledgeone WebTWAIN Release Notes
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