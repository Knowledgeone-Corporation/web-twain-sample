$(function () {
    $('#scanbtn').k1scanservice({
        onComplete: K1ScanServiceComplete, //function called when scan complete
        viewButton: $("#viewBtn"), //This is optional. Specify a element that when clicked will view scanned document
        fileUploadURL: document.location.origin + '/Home/UploadFile', //This is the service that the scanned document will be uploaded to when complete
        clientID: $("#ClientID").val(), //This is a way to identify the user who is scanning.  It should be unique per user.  Session ID could be used if no user logged in
        setupFile: document.location.origin + '/Home/DownloadSetup', //location of the insallation file if service doesn't yet exist
        version: "1.0.1" //This is optional. This will check that the version of the service is the same as whats expected by the installer.  You can update this when there is a new release
    });    
});

function K1ScanServiceComplete(data) {
    $(".filename").val(data.FileName);
    $(".filesize").text(data.SizeDisplay);
    $(".filesize").show();
    $(".fileview").show();
    $("#saveBtn").removeAttr('disabled');
}