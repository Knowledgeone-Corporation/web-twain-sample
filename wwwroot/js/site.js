$(document).ready(function () {
    $("#interface-option-dropdown").change(function (x) {
        $("#errorMessageDiv").hide();
        $(".twain-feature-group").hide();

        var $target = $(x.target);
        var selected = parseInt($target.val());

        var configuration = {
            onComplete: K1ScanServiceComplete, //function called when scan complete
            viewButton: $(".k1ViewBtn"), //This is optional. Specify a element that when clicked will view scanned document
            fileUploadURL: document.location.origin + '/Home/UploadFile', //This is the service that the scanned document will be uploaded to when complete
            clientID: $("#ClientID").val(), //This is a way to identify the user who is scanning.  It should be unique per user.  Session ID could be used if no user logged in
            setupFile: document.location.origin + '/Home/DownloadSetup', //location of the installation file if service doesn't yet exist
            interfacePath: "", // This is optional if your application lives under a subdomain.
            scannerInterface: selected,
            scanButton: $("#scanbtn"), // the scan button
        };

        K1WebTwain.Configure(configuration)
            .then(function (result) {
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
                        break;
                    case K1WebTwain.Options.ScannerInterface.Desktop:
                        RenderDesktopSelection();
                        $("#k1interface-visible").addClass("hide");
                        $("#k1interface-hidden").removeClass("hide");
                        break;
                    default:
                        break;
                }
            }).catch(function (err) {
                $("#k1interface-visible").addClass("hide");
                $("#k1interface-hidden").addClass("hide");
                console.error(err);
                $("#errorMessageOutput").text(err);
                $("#errorMessageDiv").show();
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
        request.filename = $("#sel-output-name").val();
        request.pageSizeId = $("#sel-page-size").val();
        request.documentSourceId = $("#sel-document-source").val();
        request.duplexId = $("#sel-duplex").val();

        K1WebTwain.Acquire(request)
            .then(function (data) {
                $(".filename").val(data.filename);
                $(".filesize").text(data.sizeDisplay);
                $(".filesize").show();
                $(".fileview").show();

                $("#uploadResponseOutput").text(JSON.stringify(data.uploadResponse, null, 4));
                $("#uploadResponseDiv").show();
            })
            .catch(x => {
                console.error(x);

                try {
                    $("#errorMessageOutput").text(JSON.stringify(x.responseJSON, null, 4));
                } catch (e) {
                    $("#errorMessageOutput").text(x.responseText);
                }

                $("#errorMessageDiv").show();
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
    $("#sel-scanner").change(function (y) {
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

        var device = K1WebTwain.Device(selection);

        if (!device) {
            return;
        }

        var pixelOptions = device.pixelTypeIds;
        var resolutionOptions = device.resolutionIds;
        var pageSizeOptions = device.pageSizeIds;
        var documentSourceOptions = device.documentSourceIds;
        var duplexOptions = device.duplexIds;

        populate_feature($("#sel-color"), pixelOptions);
        populate_feature($("#sel-dpi"), resolutionOptions);
        populate_feature($("#sel-page-size"), pageSizeOptions);
        populate_feature($("#sel-document-source"), documentSourceOptions);
        populate_feature($("#sel-duplex"), duplexOptions);
    });
}


function InitialiseDropDown(dropdown) {
    dropdown.empty();
    dropdown.append($("<option disabled selected>Please select</option>"));
    dropdown.selectedIndex = -1
    return dropdown;
}

function K1ScanServiceComplete(data) {
    console.log(data);
    $(".filename").val(data.filename);
    $(".filesize").text(data.sizeDisplay);
    $(".filesize").show();
    $(".fileview").show();
    $("#saveBtn").removeAttr('disabled');

    $("#uploadResponseOutput").text(JSON.stringify(data.uploadResponse, null, 4));
    $("#uploadResponseDiv").show();
}
