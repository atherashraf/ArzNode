/**
 * Created by Dr. Ather Ashraf on 1/27/2019.
 */
// var theme = 'darkblue';
// alert(theme);
// var formData = new FormData();
//
// formData.append("username", "Groucho");
// formData.append("accountnum", 123456);
// var params = {
//                url: url,
//                type: "POST",
//                data: formData,
//                dataType: "json",
//                processData: false,
//                contentType: false,
//                async: true,
//                headers: {'X-CSRFToken': token},
//            }
let getUrlParameter = function(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
var setMissingParams = function (params, isAsync) {
    if (!params["type"]) {
        params["type"] = "GET";
    }
    if (!params["dataType"]) {
        params["dataType"] = "json";
    }
    if (!params["processData"]) {
        params["processData"] = false;
    }
    if (!params["contentType"]) {
        params["contentType"] = false;
    }

    if (!params["async"]) {
        params["async"] = isAsync;
    }
    return params;
}
var callAJAX = function (params, callback) {
    // params in the form of {url:url,post:post} ets
    var params = setMissingParams(params, true);
    if ($("#waiting-div").length) $("#waiting-div").css('visibility', 'visible');
    var delayInMilliseconds = 1000; //1 second
    setTimeout(function () {
        $.ajax(params).done(function (data) {
            if ($("#waiting-div").length) $("#waiting-div").css('visibility', 'hidden');
            try {
                if (data.is_redirect) {
                    window.location.href = data.url
                }
            } catch (e) {
                console.log(e)
            }
            callback(data)
        }).fail(function (error, texStatus) {
            // console.log(error.responseText);
            if ($("#waiting-div").length) $("#waiting-div").css('visibility', 'hidden');
            console.log(texStatus)
            errorMsg = "Fail to perform your request."
            showAlertDialog(errorMsg, dialogTypes.error);
            if (progressbarModel != null)
                progressbarModel.hideProgressBar()
        })
            , delayInMilliseconds
    })
}

var callSJAX = function (params) {
    var params = setMissingParams(params, false);
    $.ajaxSetup({async: false});
    var remote = $.ajax(params).responseText;
    return remote;
}


// var dialogTypes = {
//     "default": BootstrapDialog.TYPE_DEFAULT,
//     "info": BootstrapDialog.TYPE_SUCCESS,//BootstrapDialog.TYPE_PRIMARY,
//     "primary": BootstrapDialog.TYPE_PRIMARY,
//     "success": BootstrapDialog.TYPE_SUCCESS,
//     "warning": BootstrapDialog.TYPE_WARNING,
//     "error": BootstrapDialog.TYPE_DANGER
// };
// var showAlertDialog = function (message, dialogtype, buttons) {
//     if (!buttons) buttons = [];
//     // title = dialogtype.split("-")[1];
//     // BootstrapDialog.show({
//     var dialogRef = new BootstrapDialog({
//         draggable: true,
//         title: BootstrapDialog.DEFAULT_TEXTS[dialogtype],
//         type: dialogtype,
//         message: message,
//         buttons: buttons
//     });
//     dialogRef.open();
//     setTimeout(function () {
//         dialogRef.close();
//     }, 2000);
// }