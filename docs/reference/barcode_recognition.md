## Barcode Recognition

Barcode recognition allows you to scan documents that contain barcodes and use those barcode values as document identifiers or separators. This guide covers barcode recognition for the **Hidden** and **Desktop** scanner interface modes.

> **Note:** For **Visible** and **Web** modes, barcode recognition is handled automatically through `k1ss.js` and does not require direct REST API calls.

---

- [Overview](#overview)
- [Quick-Start Workflow](#quick-start-workflow)
- [Step 1 – Configure Barcode Recognition Options at Initialisation](#step-1--configure-barcode-recognition-options-at-initialisation)
- [Step 2 – Scan Your Document](#step-2--scan-your-document)
- [Step 3 (Optional) – Identify Pages Containing Barcodes](#step-3-optional--identify-pages-containing-barcodes)
- [Step 4 – Recognise Barcodes](#step-4--recognise-barcodes)
- [Step 5 – Handle the Recognition Result](#step-5--handle-the-recognition-result)
- [Optional – Barcode Templates](#optional--barcode-templates)
- [Optional – Apply User-Provided Barcodes](#optional--apply-user-provided-barcodes)
- [API Reference](#api-reference)
- [Schemas](#schemas)
- [Enumerations](#enumerations)

---

### Overview

The barcode recognition workflow consists of three logical phases:

| Phase | APIs |
|---|---|
| **1. Initialise** | `Initialize` with `barcodeRecognitionOption` |
| **2. Scan** | `StartScan` (Hidden or Desktop flow) |
| **3. Check** *(optional)* | `CheckBarcodePages` → poll `GetBarcodeCheckingProgress` |
| **4. Recognise** | `RecognizeBarcode` → poll `GetBarcodeRecognizingProgress` → `ApplyBarcodeSelection` |

---

### Quick-Start Workflow

```
Initialize (with barcodeRecognitionOption)
    │
    ▼
StartScan / scan document pages
    │
    ▼
[Optional] CheckBarcodePages ──► poll GetBarcodeCheckingProgress
    │                              (use to get a list of pages with barcodes
    │                               before starting recognition)
    ▼
RecognizeBarcode   ──► poll GetBarcodeRecognizingProgress
    │ (completed = true)
    ▼
ApplyBarcodeSelection
    │
    ▼
AttachDocument (with isBarcodeProcessing = true)
```

---

### Step 1 – Configure Barcode Recognition Options at Initialisation

Pass a `barcodeRecognitionOption` object inside the `Initialize` request body to configure which barcode formats and orientations the engine should look for.

**Endpoint:** `POST /Initialize`  
**Request body:**
```json
{
    "clientID": 1619662600769,
    "licenseFile": "http://localhost:5000/Home/K1Licence",
    "barcodeRecognitionOption": {
        "barcodeFormats": [],
        "barcodeOrientations": []
    }
}
```

- `barcodeFormats` – array of [BarcodeFormat](#barcodeformat) values. **Default: `[]` (empty) — recognises all supported barcode formats.**
- `barcodeOrientations` – array of [BarcodeOrientation](#barcodeorientation) values. **Default: `[]` (empty) — recognises barcodes in all orientations (auto-rotate).**

---

### Step 2 – Scan Your Document

Proceed with the standard scan flow for your chosen interface.

**Hidden mode:**
```javascript
// 1. Get available devices
K1WebTwain.GetDevices()
    .then(function(devices) { ... });

// 2. Start scan
var request = {
    deviceId: 0,
    resolutionId: 0,
    pixelTypeId: 0,
    pageSizeId: 0,
    documentSourceId: 0,
    duplexId: 0
};
K1WebTwain.StartScan(request)
    .then(function(response) { ... });
```

**Desktop mode:**
```javascript
var request = { deviceId: 0 };
K1WebTwain.StartScan(request)
    .then(function(response) { ... });
```

---

### Step 3 (Optional) – Identify Pages Containing Barcodes

> **This step is optional.** You can call `RecognizeBarcode` (Step 4) directly without first checking which pages contain barcodes. Use this step when you want to know **which pages have barcodes before starting recognition** — for example, to show the user a preview or to conditionally skip recognition.

After scanning is complete, call `CheckBarcodePages` to start the barcode-detection job, then poll `GetBarcodeCheckingProgress` until `completed` is `true`.

**Start barcode page check:**  
`GET /CheckBarcodePages?clientID={clientID}`

**Poll for result:**  
`GET /GetBarcodeCheckingProgress?clientID={clientID}`

```javascript
// Example polling loop
function pollBarcodeCheck(clientID) {
    fetch(`http://localhost:19452/GetBarcodeCheckingProgress?clientID=${clientID}`)
        .then(res => res.json())
        .then(function(progress) {
            if (!progress.completed) {
                setTimeout(() => pollBarcodeCheck(clientID), 500);
                return;
            }
            // progress.barcodePages contains 1-based page indices with barcodes
            console.log('Pages with barcodes:', progress.barcodePages);
            // Proceed to Step 4 only if there are barcode pages
            if (progress.barcodePages.length > 0) {
                startBarcodeRecognition(clientID);
            }
        });
}

// Trigger check then start polling
fetch(`http://localhost:19452/CheckBarcodePages?clientID=${clientID}`)
    .then(() => pollBarcodeCheck(clientID));
```

**`GetBarcodeCheckingProgress` Response:**
```json
{
    "completed": true,
    "errorMessage": "",
    "barcodePages": [1, 3]
}
```

| Property | Type | Description |
|---|---|---|
| `completed` | boolean | `true` when the check job has finished |
| `errorMessage` | string | Non-empty if an error occurred |
| `barcodePages` | integer[] | 1-based indices of pages containing at least one barcode |

---

### Step 4 – Recognise Barcodes

> **Can be called directly after Step 2** — skipping the optional Step 3 check is fine when you know the document contains barcodes.

Call `RecognizeBarcode` with the [BarcodeLocation](#barcodelocation) and an optional template ID, then poll `GetBarcodeRecognizingProgress` until `completed` is `true`.

**Start recognition:**  
`POST /RecognizeBarcode`

```json
{
    "clientID": 1619662600769,
    "BarcodeLocation": 0,
    "templateId": ""
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `clientID` | integer | ✔ | Unique session identifier |
| `BarcodeLocation` | [BarcodeLocation](#barcodelocation) | | Where the barcode sits relative to the document pages (default: `0` – `BarcodeOnCoverSheet`) |
| `templateId` | string | | Name of a saved [barcode template](#optional--barcode-templates) to constrain the scan region; leave empty to search the full page |

**Poll for recognition result:**  
`GET /GetBarcodeRecognizingProgress?clientID={clientID}`

```javascript
function pollBarcodeRecognition(clientID) {
    fetch(`http://localhost:19452/GetBarcodeRecognizingProgress?clientID=${clientID}`)
        .then(res => res.json())
        .then(function(progress) {
            if (!progress.completed) {
                setTimeout(() => pollBarcodeRecognition(clientID), 500);
                return;
            }
            // progress.barcodeDatas contains recognised barcode data per document group
            // progress.emptyBarcodePages lists pages where no barcode was found
            handleRecognitionResult(progress);
        });
}
```

**`GetBarcodeRecognizingProgress` Response:**
```json
{
    "completed": true,
    "errorMessage": "",
    "barcodeDatas": [
        {
            "startPage": 1,
            "endPage": 2,
            "selectedBarcode": "INV-2024-001",
            "barcodes": ["INV-2024-001", "INV-2024-002"],
            "barcodeLocations": [
                {
                    "location": {
                        "locationX": 50.0,
                        "locationY": 30.0,
                        "width": 200.0,
                        "height": 60.0
                    },
                    "barcode": "INV-2024-001"
                }
            ]
        }
    ],
    "emptyBarcodePages": [3]
}
```

| Property | Type | Description |
|---|---|---|
| `completed` | boolean | `true` when recognition has finished |
| `errorMessage` | string | Non-empty if an error occurred |
| `barcodeDatas` | [BarcodeData](#barcodedata)[] | One entry per detected document group |
| `emptyBarcodePages` | integer[] | 1-based page indices where no barcode was found |

---

### Step 5 – Handle the Recognition Result

When pages contain **multiple barcodes**, you must call `ApplyBarcodeSelection` to tell the service which barcode value to use for each page.

**Apply selection:**  
`POST /ApplyBarcodeSelection`

```json
{
    "clientID": 1619662600769,
    "barcodeSelections": [
        { "pageIndex": 0, "selectedBarcode": "INV-2024-001" },
        { "pageIndex": 2, "selectedBarcode": "INV-2024-002" }
    ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `clientID` | integer | ✔ | Unique session identifier |
| `barcodeSelections` | [BarcodeSelection](#barcodeselection)[] | ✔ | Per-page barcode selection |

> After a successful call to `ApplyBarcodeSelection`, proceed to `AttachDocument` with `isBarcodeProcessing` set to `true` to generate the final document.

---

### Optional – Barcode Templates

Barcode templates define a restricted scan region on the page. This improves recognition accuracy and speed when barcodes always appear in the same location.

#### List Templates
`GET /GetListBarcodeTemplates?clientID={clientID}`  
Returns `string[]` – list of saved template names.

#### Get Template
`GET /GetBarcodeTemplate?clientID={clientID}&templateName={templateName}`  
Returns a [BarcodeTemplateResponse](#barcodetemplate).

#### Save Template
`POST /SaveBarcodeTemplate`
```json
{
    "clientID": 1619662600769,
    "templateName": "InvoiceBarcode",
    "isEditting": false,
    "barcodeLocation": {
        "locationX": 10.0,
        "locationY": 5.0,
        "width": 300.0,
        "height": 80.0
    }
}
```

#### Delete Template
`DELETE /DeleteBarcodeTemplate`
```json
{
    "clientID": 1619662600769,
    "templateName": "InvoiceBarcode"
}
```

---

### Optional – Apply User-Provided Barcodes

If automatic recognition fails or the user can manually enter/select barcodes, use `ApplyUserProvidedBarcodes` to directly assign barcode values to pages without going through the recognition engine.

`POST /ApplyUserProvidedBarcodes`

```json
{
    "clientID": 1619662600769,
    "isFirstPageEmpty": false,
    "providedBarcodes": [
        { "pageIndex": 0, "barcode": "INV-2024-001" },
        { "pageIndex": 2, "barcode": "INV-2024-002" }
    ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `clientID` | integer | ✔ | Unique session identifier |
| `isFirstPageEmpty` | boolean | | Set to `true` if the first scanned page is a blank cover sheet |
| `providedBarcodes` | [ProvidedBarcode](#providedbarcode)[] | ✔ | Barcode value per page index |

**Response:** `BarcodeData[]` – the processed barcode data after user input has been applied.

---

### API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/Initialize` | Initialise service with optional `barcodeRecognitionOption` |
| `GET` | `/CheckBarcodePages` | Start the job to detect pages containing barcodes |
| `GET` | `/GetBarcodeCheckingProgress` | Poll for barcode detection progress and results |
| `POST` | `/RecognizeBarcode` | Start the barcode recognition job |
| `GET` | `/GetBarcodeRecognizingProgress` | Poll for recognition progress and results |
| `POST` | `/ApplyBarcodeSelection` | Apply the selected barcode per page |
| `POST` | `/ApplyUserProvidedBarcodes` | Assign manually provided barcodes to pages |
| `GET` | `/GetListBarcodeTemplates` | List all saved barcode templates |
| `GET` | `/GetBarcodeTemplate` | Retrieve a specific barcode template |
| `POST` | `/SaveBarcodeTemplate` | Save or update a barcode template |
| `DELETE` | `/DeleteBarcodeTemplate` | Delete a barcode template |

---

### Schemas

#### BarcodeRecognitionOption
**type:** object  
**description:** Configures the barcode recognition engine. Passed inside the `Initialize` request body.
```json5
{
    barcodeFormats: [0],       // array of BarcodeFormat values; [] = all formats
    barcodeOrientations: [0]   // array of BarcodeOrientation values; [] = all orientations (auto-rotate)
}
```

#### BarcodeData
**type:** object  
**description:** Represents a recognised barcode group spanning one or more pages.
```json5
{
    startPage: 1,                   // 1-based index of the first page in this document group
    endPage: 2,                     // 1-based index of the last page in this document group
    selectedBarcode: "INV-001",     // the currently selected barcode value for this group
    barcodes: ["INV-001", "INV-002"], // all barcode values detected on the cover/separator page
    barcodeLocations: [             // pixel locations of each barcode on the page
        {
            location: {
                locationX: 50.0,
                locationY: 30.0,
                width: 200.0,
                height: 60.0
            },
            barcode: "INV-001"
        }
    ]
}
```

#### BarcodeCheckingProgress
**type:** object  
**description:** Progress response from `GetBarcodeCheckingProgress`.
```json5
{
    completed: true,           // true when the detection job has finished
    errorMessage: "",          // error description, empty on success
    barcodePages: [1, 3]       // 1-based page indices that contain at least one barcode
}
```

#### BarcodeRecognizingProgress
**type:** object  
**description:** Progress response from `GetBarcodeRecognizingProgress`.
```json5
{
    completed: true,           // true when the recognition job has finished
    errorMessage: "",          // error description, empty on success
    barcodeDatas: [ ],         // array of BarcodeData objects
    emptyBarcodePages: [2]     // 1-based page indices where no barcode was found
}
```

#### BarcodeSelection
**type:** object  
**description:** Maps a page index to the chosen barcode value. Used in `ApplyBarcodeSelection`.
```json5
{
    pageIndex: 0,              // 0-based page index
    selectedBarcode: "INV-001" // the barcode value to assign to this page
}
```

#### ProvidedBarcode
**type:** object  
**description:** Maps a page index to a manually supplied barcode value. Used in `ApplyUserProvidedBarcodes`.
```json5
{
    pageIndex: 0,              // 0-based page index
    barcode: "INV-001"         // the barcode value to assign
}
```

#### BarcodeTemplate
**type:** object  
**description:** Response from `GetBarcodeTemplate`.
```json5
{
    templateName: "InvoiceBarcode",
    location: {
        locationX: 10.0,
        locationY: 5.0,
        width: 300.0,
        height: 80.0
    }
}
```

#### Location
**type:** object  
**description:** Defines a rectangular region on the page (in pixels).
```json5
{
    locationX: 10.0,   // X coordinate of the top-left corner
    locationY: 5.0,    // Y coordinate of the top-left corner
    width: 300.0,      // width of the region
    height: 80.0       // height of the region
}
```

---

### Enumerations

#### BarcodeLocation
**type:** integer  
**description:** Specifies where the barcode separator is placed relative to the document pages.
```
0 – BarcodeOnCoverSheet  The barcode appears on a dedicated cover/separator sheet that precedes the document pages.
1 – BarcodeOnDocument    The barcode appears on the document pages themselves (not on a separate sheet).
```

#### BarcodeFormat
**type:** integer  
**description:** Specifies the barcode symbology to detect.
```
0 – Default  Auto-detect all supported barcode formats.
```

#### BarcodeOrientation
**type:** integer  
**description:** Specifies the reading direction of the barcode. Providing all four values (or an empty array) enables automatic rotation detection.
```
0 – LeftToRight   Barcode reads left-to-right (no rotation).
1 – TopToBottom   Barcode reads top-to-bottom (90° rotation).
2 – RightToLeft   Barcode reads right-to-left (180° rotation).
3 – BottomToTop   Barcode reads bottom-to-top (270° rotation).
```
