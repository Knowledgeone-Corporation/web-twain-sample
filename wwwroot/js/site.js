$(document).ready(function () {
    InitialiseInterfaceOption();

    $("#interface-option-dropdown").change(function (x) {

        $("#errorMessageDiv").hide();
        $(".twain-feature-group").hide();

        var $target = $(x.target);
        var selected = parseInt($target.val());

        var configuration = {
            onComplete: K1ScanServiceComplete, //function called when scan complete
            viewButton: $(".k1ViewBtn"), //This is optional. Specify a element that when clicked will view scanned document
            fileUploadURL: document.location.origin + '/Home/UploadFile', //This is the service that the scanned document will be uploaded to when complete,
            fileUploadHeaders: [
                {
                    key: "X-Access-Token",
                    value: "Test"
                }
            ], // This is optional. Specify additional headers for the request to the upload server.
            clientID: $("#ClientID").val(), //This is a way to identify the user who is scanning.  It should be unique per user.  Session ID could be used if no user logged in
            setupFile: document.location.origin + '/Home/DownloadSetup', //location of the installation file if service doesn't yet exist
            licenseFile: document.location.origin + '/Home/K1Licence', //location of the license file If it unset, value will fallback to Current website url + '/Home/K1Licence'
            interfacePath: "", // This is optional if your application lives under a subdomain.
            scannerInterface: selected,
            scanButton: $("#scanbtn"), // the scan button
        };

        K1WebTwain.Configure(configuration)
            .then(function (result) {
                $("#btn-acquire").show();
                $("#scanbtn").show();
                $(".alert").hide();
                $("#k1interface-visible").addClass("hide");
                $("#k1interface-hidden").addClass("hide");

                K1WebTwain.ResetService().then(function () {
                    ShowWait("Preparing...", false);
                    //setTimeout(() => {
                        switch (result.scannerInterface) {
                            case K1WebTwain.Options.ScannerInterface.Visible:
                            case K1WebTwain.Options.ScannerInterface.Web:
                                $("#k1interface-visible").removeClass("hide");
                                $("#k1interface-hidden").addClass("hide");
                                break;
                            case K1WebTwain.Options.ScannerInterface.Hidden:
                                RenderSelection();
                                $("#k1interface-visible").addClass("hide");
                                $("#k1interface-hidden").removeClass("hide");
                                $("#sel-output-name").val("ScanFile" + (Math.floor((Math.random() * 10000) + 100000)));

                                break;
                            case K1WebTwain.Options.ScannerInterface.Desktop:
                                RenderDesktopSelection();
                                $("#k1interface-visible").addClass("hide");
                                $("#k1interface-hidden").removeClass("hide");
                                $("#sel-output-name").val("ScanFile" + (Math.floor((Math.random() * 10000) + 100000)));
                                break;
                            default:
                                break;

                        }
                        HideWait();
                    //}, 4000)
                });

            }).catch(function (err) {
                $("#k1interface-visible").addClass("hide");
                $("#k1interface-hidden").addClass("hide");
                console.error(err);
                $("#errorMessageOutput").text(err);
                $("#errorMessageDiv").show();

                K1WebTwain.ResetService();
            });

        $("#scanbtn").click(function (x) {
            InitialiseInterfaceOption();
        });
    });

    var $selected = $("#SelectedInterface").val();
    if ($selected.length > 0) {
        $("#interface-option-dropdown").val($selected).change();
    }

});

function RenderDesktopSelection() {
    K1WebTwain.GetDevices()
        .then(function (devices) {
            var $scanner_dropdown = InitialiseDropDown($("#sel-scanner"));

            for (var i = 0; i < devices.length; i++) {
                $scanner_dropdown.append($("<option />")
                    .val(devices[i].id)
                    .text(devices[i].name));
            }

            $("#sel-scanner").unbind();
            $("#sel-scanner").change(DesktopScannerSelect);
            DesktopScannerSelect();

            $("#device-group").show();
            BindAcquire();


            var populate_dropdown = function ($dropdown, dict) {
                InitialiseDropDown($dropdown);
                for (var prop in dict) {
                    $dropdown.append($("<option />")
                        .val(dict[prop])
                        .text(prop));
                }
            };

            populate_dropdown($("#sel-ocr-type"), K1WebTwain.Options.OcrType);
            populate_dropdown($("#sel-output"), K1WebTwain.Options.OutputFiletype);
            populate_dropdown($("#sel-save-to"), K1WebTwain.Options.SaveToType);
        })
        .catch(function (err) {
            console.error(err);
        });
}

function RenderSelection() {
    K1WebTwain.GetDevices()
        .then(function (devices) {
            $("#device-group").show();
            BindAcquire();

            var populate_dropdown = function ($dropdown, dict) {
                InitialiseDropDown($dropdown);
                for (var prop in dict) {
                    $dropdown.append($("<option />")
                        .val(dict[prop])
                        .text(prop));
                }
            };

            populate_dropdown($("#sel-ocr-type"), K1WebTwain.Options.OcrType);
            populate_dropdown($("#sel-output"), K1WebTwain.Options.OutputFiletype);
            populate_dropdown($("#sel-save-to"), K1WebTwain.Options.SaveToType);
            BindScannerSelection(devices);
        })
        .catch(function (err) {
            console.error(err);
        });
}

function BindAcquire() {
    $("#btn-acquire").unbind();
    $("#btn-acquire").click(function (x) {

        $("#errorMessageDiv").hide();
        var request = {
        };

        request.deviceId = $("#sel-scanner").val();
        request.resolutionId = $("#sel-dpi").val();
        request.pixelTypeId = $("#sel-color").val();
        request.filetype = $("#sel-output").val();
        request.ocrType = $("#sel-ocr-type").val();
        request.saveToType = $("#sel-save-to").val();
        request.filename = $("#sel-output-name").val();
        request.pageSizeId = $("#sel-page-size").val();
        request.documentSourceId = $("#sel-document-source").val();
        request.documentSoureName = $("#sel-document-source option:selected").text();
        request.duplexId = $("#sel-duplex").val();

        K1WebTwain.Acquire(request)
            .then(function (data) {
                $(".filename").val(data.filename);
                $(".filesize").text(data.sizeDisplay);
                $(".filesize").show();
                $(".fileview").show();

                var responseMessage = data.uploadResponse;

                if (data.saveToType === K1WebTwain.Options.SaveToType.Local) {
                    $("#viewBtn").text("Download");
                    $(".upload-response-header").text("File Info:");
                    responseMessage = {
                        filename: data.filename,
                        fileSize: `${data.fileLength} (${data.sizeDisplay})`,
                        fileExtension: data.extension
                    };
                } else {
                    $("#viewBtn").text("View");
                    $(".upload-response-header").text("Response from file upload route:");
                }

                $("#uploadResponseOutput").text(JSON.stringify(responseMessage, null, 4));
                $("#uploadResponseDiv").show();

                InitialiseInterfaceOption();
            })
            .catch(function (error) {
                if (error) {
                    if (error.statusText && error.statusText === 'timeout') {
                        $("#errorMessageOutput").text('Timeout error while processing/uploading scanned documents.');
                    }

                    if (!!error.responseJSON) {
                        try {
                            $("#errorMessageOutput").text(JSON.stringify(error.responseJSON, null, 4));
                        } catch (e) {
                            if (!!error.responseText) {
                                $("#errorMessageOutput").text(error.responseText);
                            }
                        }
                    }

                    if (!!error.responseText) {
                        $("#errorMessageOutput").text(error.responseText);
                    }

                    $("#errorMessageDiv").show();

                    InitialiseInterfaceOption();
                }
            });
    });
}

function BindScannerSelection(devices) {
    var $scanner_dropdown = InitialiseDropDown($("#sel-scanner"));

    for (var i = 0; i < devices.length; i++) {
        $scanner_dropdown.append($("<option />")
            .val(devices[i].id)
            .text(devices[i].name));
    }
    $("#sel-scanner").unbind();
    $("#sel-scanner").change(ScannerSelect);

    ScannerSelect();
}

function DesktopScannerSelect() {
    var selection = $("#sel-scanner").val();

    if (!selection || selection == -1) {
        $("#btn-acquire").attr('disabled', 'disabled');
        return;
    }

    $("#btn-acquire").removeAttr('disabled')
}

function ScannerSelect() {
    var populate_feature = function ($dropdown, dict) {
        InitialiseDropDown($dropdown);

        var isEmpty = jQuery.isEmptyObject(dict);

        if (isEmpty) {
            $dropdown.parent().hide();
            return;
        }

        for (var prop in dict) {
            $dropdown.append($("<option />")
                .val(prop)
                .text(dict[prop]));
        }

        $dropdown.parent().show();
    };

    var selection = $("#sel-scanner").val();

    if (!selection) {
        return;
    }

    K1WebTwain.Device(selection)
        .then(function (device) {
            populate_feature($("#sel-document-source"), {});
            populate_feature($("#sel-color"), {});
            populate_feature($("#sel-dpi"), {});
            populate_feature($("#sel-page-size"), {});
            populate_feature($("#sel-duplex"), {});

            if (!device) {
                $("#btn-acquire").attr('disabled', 'disabled');
                return;
            }

            $("#btn-acquire").removeAttr('disabled')
            BindDocumentSource(device.documentSourceIds)
        })
        .catch(function (ex) {
            console.error(ex);
            var err = JSON.stringify(ex.responseJSON, null, 4);
            $("#errorMessageOutput").text(err);
            $("#errorMessageDiv").show();
        });
}


function BindDocumentSource(documentSources) {
    var $scanner_dropdown = InitialiseDropDown($("#sel-document-source"));

    for (var prop in documentSources) {
        $scanner_dropdown.append($("<option />")
            .val(documentSources[prop].id)
            .text(documentSources[prop].name));
    }

    $scanner_dropdown.parent().show();

    $("#sel-document-source").unbind();
    $("#sel-document-source").change(DocumentSourceSelect);

    DocumentSourceSelect();
}

function DocumentSourceSelect() {
    var populate_feature = function ($dropdown, dict) {
        InitialiseDropDown($dropdown);

        var isEmpty = jQuery.isEmptyObject(dict);

        if (isEmpty) {
            $dropdown.parent().hide();
            return;
        }

        for (var prop in dict) {
            $dropdown.append($("<option />")
                .val(prop)
                .text(dict[prop]));
        }

        $dropdown.parent().show();
    };

    var selection = $("#sel-document-source").val();

    if (!selection) {
        return;
    }

    var deviceSelection = $("#sel-scanner").val();

    var device = K1WebTwain.FetchedDevice(deviceSelection);

    if (!device) {
        return;
    }
    var fUnit = device.documentSourceIds[selection];
    populate_feature($("#sel-color"), fUnit.pixelTypeIds);
    populate_feature($("#sel-dpi"), fUnit.resolutionIds);
    populate_feature($("#sel-page-size"), fUnit.pageSizeIds);
    populate_feature($("#sel-duplex"), fUnit.duplexIds);
}
function InitialiseInterfaceOption() {

    var dropdown = $("#interface-option-dropdown");

    dropdown.empty();
    dropdown.append("<option disabled selected>Please select...</option>");
    dropdown.append("<option value='0'>Hidden : Not using Webtwain or Native UI</option>");
    dropdown.append("<option value='1'>Visible : Uses Webtwain and Native UI</option>");
    dropdown.append("<option value='2'>Web : only uses Webtwain UI</option>");
    dropdown.append("<option value='3'>Desktop : only uses Native scanner UI</option>");

    $("#btn-acquire").hide();
    $("#scanbtn").hide();

    $("#k1interface-visible").addClass("hide");
    $("#k1interface-hidden").addClass("hide");

}


function InitialiseDropDown(dropdown) {
    dropdown.empty();
    //dropdown.append($("<option disabled selected>Please select</option>"));
    dropdown.selectedIndex = 0;
    return dropdown;
}

function K1ScanServiceComplete(data) {
    $(".filename").val(data.filename);
    $(".filesize").text(data.sizeDisplay);
    $(".filesize").show();
    $(".fileview").show();
    $("#saveBtn").removeAttr('disabled');

    var responseMessage = data.uploadResponse;

    if (data.saveToType === K1WebTwain.Options.SaveToType.Local) {
        $("#viewBtn").text("Download");
        $(".upload-response-header").text("File Info:");
        responseMessage = {
            filename: data.filename,
            fileSize: `${data.fileLength} (${data.sizeDisplay})`,
            fileExtension: data.extension
        };
    } else {
        $("#viewBtn").text("View");
        $(".upload-response-header").text("Response from file upload route:");
    }

    $("#uploadResponseOutput").text(JSON.stringify(responseMessage, null, 4));
    $("#uploadResponseDiv").show();
}


function ShowWait(strMessage, blnAllowCancel) {
    if (strMessage)
        $('.k1ss-msg').text(strMessage);
    else
        $('.k1ss-msg').text('Loading, please wait...');
    if (!blnAllowCancel) blnAllowCancel = false;
    if (blnAllowCancel == true)
        $(".k1ss-msgbox .k1ss-close").show();
    else
        $(".k1ss-msgbox .k1ss-close").hide();
    $('.k1ss-wait-div').show();
}

function HideWait() {
    $('.k1ss-wait-div').hide();
}