/*
 *
 *   TRS
 *   author: Hieu Ngo
 *   last update: 03/16/2023
*/

function GetDomain() {
    var protocol = window.location.protocol;
    var host = window.location.host;
    var pathName = window.location.pathname.split('/');//get project name

    var url = protocol + "//" + host + "/" + pathName[1] + "/";
    if (host.indexOf("localhost:") >= 0) { //for Kestrel
        url = protocol + "//" + host + "/";
    }
    if (host.indexOf("localhost") >= 0 && pathName.indexOf("spda_enhancement") >= 0) {
        url = url + "/search/";
    }

    return url;
}

function GetURLParams(k) {
    var p = {};
    location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (s, k, v) { p[k] = v })
    return k ? p[k] : p;
}

//Format phone number (xxx) xxx-xxxx
function FormatPhoneNumber() {
    $('.phone').each(function (index, element) {
        $(element).keyup(function () {
            var phone = $(element).val().replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            $(element).val(phone);
        });
    });
}

//Format lat long xx.xxxxx
function FormatLatLong() {
    $('.latlong').each(function (index, element) {
        $(element).keyup(function () {
            var phone = $(element).val().replace(/(\d{2})(\d{5})/, '$1.$2');
            $(element).val(phone);
        });
    });
}

//Set error for each control
function SetError(objValues) {
    var isValid = true;
    var iCount = Object.keys(objValues).length;

    for (var i = 0; i < iCount; i++) {
        var value = objValues["element" + (i + 1)].value;
        var control = objValues["element" + (i + 1)].control;

        if (value === "") {
            $("#" + control).parent().addClass("has-error");
            isValid = false;
        }
        else {
            $("#" + control).parent().removeClass("has-error");
        }
    }

    return isValid;
}

//Clear controls with parent
//Ex: ClearControls("#addNewIPManager", ":input", "");
function ClearControls(parent, controls, resetValue) {
    $(parent + " " + controls).val(resetValue);
    $('input:checkbox').removeAttr('checked');
}

//Speech to Text
function SpeechtoText(controlID) {
    if ('webkitSpeechRecognition' in window) {
        var speechRecognizer = new webkitSpeechRecognition();
        speechRecognizer.continuous = true;
        speechRecognizer.interimResults = true;
        speechRecognizer.lang = 'en-IN';
        speechRecognizer.start();

        var finalTranscripts = '';

        speechRecognizer.onresult = function (event) {
            var interimTranscripts = '';
            for (var i = event.resultIndex; i < event.results.length; i++) {
                var transcript = event.results[i][0].transcript;
                transcript.replace("\n", "<br>");
                if (event.results[i].isFinal) {
                    finalTranscripts += transcript;
                } else {
                    interimTranscripts += transcript;
                }
            }
            $("#" + controlID).val(finalTranscripts + ' ' + interimTranscripts);
        };
        speechRecognizer.onerror = function (event) {
        };
    } else {
        alert('Your browser is not supported. If google chrome, please upgrade!');
    }
}

//Keypress number only
function NumberOnly(control) {
    $(control).keypress(function (e) {
        //if the letter is not digit then display error and don't type anything
        if (e.which !== 8 && e.which !== 0 && e.which !== 0 && (e.which < 48 || e.which > 57)) {
            //alert("Numbers only please");
            e.preventDefault();
            return false;
        }
    });
}

function NumberWithDotOnly(control) {
    $(control).keypress(function (e) {
        if ((e.which !== 46 || $(this).val().indexOf('.') !== -1) && e.which !== 0 && (e.which < 48 || e.which > 57)) {
            e.preventDefault();
            return false;
        }
    });
}

function NumberWithDoDash(control) {
    $(control).keypress(function (e) {
        if ((e.which !== 45) && (e.which !== 46) && (e.which !== 8) && e.which !== 0 && (e.which < 48 || e.which > 57)) {
            e.preventDefault();
            return false;
        }
    });
}

function ConvertToInt(value) {
    var result = parseInt(value !== "" ? value : 0);

    return result;
}

function AddSlashToDatetime(control) {
    if ($(control).val().length === 2) {
        $(control).val($(control).val() + "/");
    } else if ($(control).val().length === 5) {
        $(control).val($(control).val() + "/");
    }
}

function AutoMoveNextInput(control) {
    $(control).keyup(function () {
        if (this.value.length === this.maxLength) {
            $(this).closest('div').next('div').find(control).focus();
        }
    });
}

function YearDifference(startDate, endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    var diff = (endDate.getTime() - startDate.getTime()) / 1000;
    diff /= (60 * 60 * 24);

    return Math.abs(Math.round(diff / 365.25));
}

//Matches
//    +90.0, -127.554334
//    45, 180
//    -90, -180
//    -90.000, -180.0000
//    +90, +180
//    47.1231231, 179.99999999

//Doesn't Match
//    -90., -180.
//    +90.1, -100.111
//    -91, 123.456
//    045, 180

function ValidateLatLong(control) {
    var latlongReg = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/;
    var isValid = false;
    var latlong = $(control).val();

    if (latlongReg.test(latlong)) {
        isValid = true;
    }

    return isValid;
}

function ValidateGPSCoordinates(latControl, longControl) {
    var gpsReg = /^([-+]?)([\d]{1,2})(((\.)(\d+)(,)))(\s*)(([-+]?)([\d]{1,3})((\.)(\d+))?)$/;
    var isValid = false;
    var latlong = $(latControl).val() + ", " + $(longControl).val();

    if (gpsReg.test(latlong)) {
        isValid = true;
    }

    return isValid;
}

function ValidateWorkEmail(control) {
    var emailReg = /^(?!\.)("([^"\r\\]|\\["\r\\])*"|([-a-z0-9!#$%&'*+\=?^_`{|}~]|(?<!\.)\.)*)(?<!\.)@(?!gmail.com)(?!yahoo.com)(?!hotmail.com)(?!yahoo.co.in)(?!aol.com)(?!live.com)(?!outlook.com)(?!verizon.com)(?!verizon.net)[a-z0-9][\w\.-]*[a-z0-9]\.[a-z][a-z\.]*[a-z]/;
    var isValid = false;
    var email = $(control).val();

    if (email.match(emailReg)) {
        isValid = true;
    }

    return isValid;
}

function ValidateEmail(control) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    var isValid = false;
    var email = $(control).val();

    if (email.match(emailReg)) {
        isValid = true;
    }

    return isValid;
}

function ValidateTRSEmail(control) {
    var emailReg = /^([\w-\.]+@(trs.virginia.gov))/i;
    var isValid = false;
    var email = $(control).val();

    if (emailReg.test(email)) {
        isValid = true;
    }

    return isValid;
}

function ValidateDecimal(control) { // Valid decimal: Only 5 digit before decimal or zero 0, 000.36, 1.36, 11.34, 111.12
    var decimalReg = /^\d{1,6}(\.\d{1,2})?$/;
    var isValid = false;
    var decimal = $(control).val();

    if (decimalReg.test(decimal)) {
        isValid = true;
    }

    return isValid;
}

function ValidateThreeDigitNumber(control) { // Valid decimal: Only Three digit 1, 11, 111
    var decimalReg = /^[0-9]{1,3}$/;
    var isValid = false;
    var decimal = $(control).val();

    if (decimalReg.test(decimal)) {
        isValid = true;
    }

    return isValid;
}

function ValidateSchoolEmail(control) {
    var emailReg = /^([\w-\.]+@([\w-]+\.edu))/i;
    var isValid = false;
    var email = $(control).val();

    if (emailReg.test(email)) {
        isValid = true;
    }

    return isValid;
}

function ValidPassword(control) {
    var pattern = new RegExp(/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/);
    //This regex will enforce these rules:
    //At least one upper case english letter
    //At least one lower case english letter
    //At least one digit
    //At least one special character
    //Minimum 8 in length

    var isValid = false;
    var pwd = $(control).val();

    if (pattern.test(pwd)) {
        isValid = true;
    }

    return isValid;
}

function ValidateDate(monthControl, dayControl, yearControl, minAge, maxAge) {
    var isValid = false;
    var today = new Date();
    var fromYear = today.getFullYear() - maxAge;
    var toYear = today.getFullYear() - minAge;
    var mm = $(monthControl).val();
    var dd = $(dayControl).val();
    var yyyy = $(yearControl).val();

    if (mm < 13 && dd < 32 && (yyyy > fromYear && yyyy < toYear)) {
        var newDate = new Date(yyyy, mm, 0);

        if (dd > newDate.getDate())
            isValid = false;
        else
            isValid = true;
    }

    return isValid;
}

function ValidateDateFormat(dtValue) {
    var dtRegex = new RegExp(/\b\d{1,2}[\/]\d{1,2}[\/]\d{4}\b/);

    return dtRegex.test(dtValue);
}

function ValidateInputMinMax(control) {
    var isValid = false;

    var min = $(control).attr("min-data");
    var max = $(control).attr("max-data");

    var len = $(control).val().length;

    if (len >= min && len <= max)
        isValid = true;

    return isValid;
}

function ValidateWithToastr(jsonValidation) {
    var isValid = true;
    var validationMessage = '<ul id="errList">';

    $.each(jsonValidation.form, function (i, form) {
        if ($(form.control).val() === form.condition || typeof ($(form.control).val()) === form.condition) {
            isValid = false;
            validateControl(form.control, false);
            validationMessage = validationMessage + '<li>' + form.message + '</li>';
        }
        else
            validateControl(form.control, true);
    });

    if (!isValid) {
        validationMessage = validationMessage + '</ul>';
    }
    else {
        validationMessage = '';
    }

    return validationMessage;
}

function GetParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//Cut string to fit maxlength
function CutStringAsMaxLength(maxLength, control) {
    var content = $(control).val();
    var remaining = maxLength - content.length;

    var trimText = $.trim(content).substring(0, maxLength).split(" ").slice(0, -1).join(" ") + "";

    return trimText;
}

//Cut HTML to fit maxlength
function CutHTMLAsMaxLength(maxLength, control) {
    var content = $(control).val();
    content = content.replace(/<[^>]*>/g, " ");
    content = content.replace(/\s+/g, ' ');
    content = content.trim();

    var trimText = $.trim(content).substring(0, maxLength).split(" ").slice(0, -1).join(" ") + "";

    return trimText;
}

function CountWords(text) {
    var regex = /\s+/gi;
    var wordCount = text.trim().replace(regex, ' ').split(' ').length;

    return wordCount;
}

function CountWordsInHTMLFormat(text) {
    text = text.replace(/<[^>]*>/g, " ");
    text = text.replace(/\s+/g, ' ');
    text = text.trim();

    var wordCount = text.split(" ").length;

    return wordCount;
}

//If check on YES needs to select answer or type in answer
function SetRequiredAttribute(controlType, triggerControl, forceRequireControl, compareValue) {
    var isYes = false;
    switch (controlType) {
        case "radio":
        case "checkbox"://use name
            if ($(triggerControl).prop("checked"))
                isYes = true;
            break;
        case "select":
            if ($(triggerControl).val() === compareValue)
                isYes = true;
            break;
        case "checkboxlist":
            if ($(triggerControl).val() === compareValue && $(triggerControl).prop("checked"))
                isYes = true;
            break;
    }

    if (isYes) {
        $(forceRequireControl).removeAttr("disabled");
        $(forceRequireControl).addClass("required");
    }
    else {
        $(forceRequireControl).attr("disabled", "disabled");
        $(forceRequireControl).removeClass("required");
        $(forceRequireControl).val("");
    }
}

function FromDateGreaterThanToDate(fromDate, toDate) {
    fromDate = new Date(fromDate);
    toDate = new Date(toDate);
    var isInvalid = false;

    if (fromDate > toDate)
        isInvalid = true;

    return isInvalid;

}

//Display errors only in dev
function ConsoleLog(text) {
    var domain = location.hostname.toLowerCase();

    switch (domain) {
        case "localhost":
        case "spda-test":
            console.log(text);
            break;
        default:
            console.log("something went wrong");
    }
}

function DynamicallyLoadScript(url) {
    $('body').append($('<script type="text/javascript" src="' + url + '"></script>'));
}

function jsonToDate(jsonDate) {
    if (jsonDate !== '' && jsonDate !== null && jsonDate !== 'null') {
        var dateString = jsonDate.substr(6);
        var currentTime = new Date(parseInt(dateString));
        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        var year = currentTime.getFullYear();
        var date = month + "/" + day + "/" + year;

        return date;
    }
    else {
        return '';
    }
}

function jsonToDateTime(jsonDate) {
    if (jsonDate !== '' && jsonDate !== null && jsonDate !== 'null') {
        var nowDate = new Date(parseInt(jsonDate.substr(6)));
        var result = "";
        result = nowDate.format("ddd mmm dd yyyy HH:MM:ss");

        return result;
    }
    else {
        return '';
    }
}

function validateControl(controlID, isValid) {
    if (!isValid)
        $(controlID).css('border-color', 'red');
    else
        $(controlID).css('border-color', '');
}

function RemoveLastCharacter(text) {
    return text.slice(0, -1);
}

$(document).on("hidden.bs.modal", function () {
    $('.modal')
        .find("input[type=text],input[type=number],input[type=hidden],input[type=email],textarea").not("input[name='__RequestVerificationToken']")
        .val('')
        .end()
        .find("select")
        .val('0')
        .end()
        .find("input[type=checkbox],input[type=radio]")
        .prop("checked", "")
        .end();
});

function CheckFileTypes(control) {
    var fullFileName = control.value;
    var arr = fullFileName.split('.');
    var countDots = arr.length - 1;
    //Check for double extension FileName.extension.extension
    if (countDots > 1) {
        return false;
    }
    if (fullFileName !== "") {
        var pattern = /^[A-Za-z0-9 '-_]+$/;
        var fileName = arr[0].substring(fullFileName.lastIndexOf('\\') + 1);
        if (!pattern.test(fileName)) {
            return false;
        }
        var ext = arr[1];//fileName.substring(fileName.lastIndexOf('.') + 1);
        var arrFileTypes = ['doc', 'docx', 'xls', 'xlsx', 'pdf', 'ppt', 'pptx', 'txt', 'png', 'tif', 'jpeg', 'jpg', 'bmp'];
        var result = $.inArray(ext.toLowerCase(), arrFileTypes);
        return result > -1 ? true : false;
    }
    return true;
}

function autoResize(id) {
    var newheight;
    var newwidth;

    if (document.getElementById) {
        newheight = document.getElementById(id).contentWindow.document.body.scrollHeight;
        newwidth = document.getElementById(id).contentWindow.document.body.scrollWidth;
    }

    document.getElementById(id).height = (newheight) + "px";
    document.getElementById(id).width = (newwidth) + "px";
}

function getVerificationTokenName() {
    return "__RequestVerificationToken";
}

function GetVerificationToken(formName) {
    formName = "#" + formName;
    var result = "";
    $(formName).children().each(
        function () {
            var child = $(this);
            if (child.attr("name") === getVerificationTokenName()) {
                if (result === "") result = child.attr("value");
            }
        }
    );
    return result;
}

function ProtocolRedirect() {
    var URL = location.href;
    if (URL.indexOf("http://") > -1 && URL.indexOf("localhost") <= 0) {
        var hostName = $(location).attr('host');
        var pathName = window.location.pathname;
        location.href = "https://" + hostName + pathName;
    }
}

//Convert Gregorian to Unix
function ConvertDateTimeToUnixTime(dateTime) {
    dateTime = new Date(dateTime);
    return dateTime.getTime();
}

//No more Cut/Copy and Paste
function PreventCopyPaste(control) {
    $(control).bind("cut copy paste", function (e) {
        e.preventDefault();
    });
}

//Show password
function ShowPassword(triggerControl, control, findControl, currentCss, newCss) {
    $(triggerControl).click(function () {
        if ('password' == $(control).attr('type')) {
            $(control).prop('type', 'text');
            $(findControl).removeClass(currentCss);
            $(findControl).addClass(newCss);
        } else {
            $(control).prop('type', 'password');
            $(findControl).removeClass(newCss);
            $(findControl).addClass(currentCss);
        }
    });
}

function DisableControl(arrControl) {
    //DisableControl(["#btnEvent:true", "#txtEmail:true"]);
    arrControl.forEach(function (value) {
        let arr = value.split(':');
        let control = arr[0];
        let flag = arr[1];
        flag = flag == 'true' ? true : false;
        $(control).prop("disabled", flag);
    });
}

function ReadonlyControl(arrControl) {
    //DisableControl(["#btnEvent:true", "#txtEmail:true"]);
    arrControl.forEach(function (value) {
        let arr = value.split(':');
        let control = arr[0];
        let flag = arr[1];
        flag = flag == 'true' ? true : false;
        $(control).prop("readonly", flag);
        //$(control).attr("style")#e9ecef opacity 1
    });
}

function ClassVisuallyHidden(arrControl) {
    //ClassVisuallyHidden(["#notification:remove", "#signup:add"]);
    arrControl.forEach(function (value) {
        let arr = value.split(':');
        let control = arr[0];
        let command = arr[1];
        if (command == "remove") {
            if ($(control).hasClass("visually-hidden"))
                $(control).removeClass("visually-hidden");
        }
        else {
            if (!$(control).hasClass("visually-hidden"))
                $(control).addClass("visually-hidden");
        }
    });
}

function PreventEnterHit() {
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
}

function ValidateSec501(value) {
    var pattern = new RegExp(/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/);
    //Sec501 https://www.vita2.virginia.gov/uploadedFiles/Library/PSGs/Information_Security_Standard_SEC501_06_07012011.pdf
    //At least eight characters in length; and
    //b.Utilize at least three of the following four:
    //1) Special characters,
    //2) Alphabetical characters,
    //3) Numerical characters,
    //4) Combination of upper case and lower case letters.

    var isValid = false;
    var pwd = value;

    if (pattern.test(pwd)) {
        isValid = true;
    }

    return isValid;
}

function ControlFocus(control) {
    $(control).focus();
}

function ControlRemoveFocus(control) {
    $(control).blur();
}

function SetWordings(control, wordings, isAppend = false, replaceWord = "", controlValue = "") {
    if (replaceWord != "") {
        if (isAppend) {
            let temp = `${$(control).html()}`;
            if (temp.indexOf(wordings) < 0)
                $(control).html(temp + wordings.replace(replaceWord, $(controlValue).val()) + "<br/>");
        } else {
            $(control).html(wordings.replace(replaceWord, $(controlValue).val()));
        }
    } else {
        if (isAppend) {
            let temp = `${$(control).html()}`;
            if (temp.indexOf(wordings) < 0)
                $(control).html(temp + wordings + "<br/>");
            else
                $(control).html(temp);
        } else {
            $(control).html(wordings);
        }
    }
}

function GetValue(control) {
    return $(control).val().trim();
}

function IsCheckboxChecked(control) {
    return $(control).prop("checked");
}