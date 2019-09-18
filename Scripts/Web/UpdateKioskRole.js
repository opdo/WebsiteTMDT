var serviceHub = $.connection.serviceHub;
serviceHub.client.AlertMessage = function (text) {
    alert(text);
}
serviceHub.client.UpdateStatus = function (_class, id, status) {
    var checkbox = $("." + _class + "[name='" + id + "']");
    if (checkbox.length < 1) return;
    checkbox.prop('checked', status);
    updateAllCheckbox();
}

serviceHub.connection.start().done(function () { });

$(".group-kiosk").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        $("[group='" + id + "']").each(function (index) {
            var _status = $(this).is(":checked");
            if (_status == status) return;
            $(this).prop("checked", status);
            sendCheckedToSignalR($(this));
        });
        updateAllCheckbox();
    });
});

$(".service-kiosk").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        $("[service='" + id + "']").each(function (index) {
            var _status = $(this).is(":checked");
            if (_status == status) return;
            $(this).prop("checked", status);
            sendCheckedToSignalR($(this));
        });
        updateAllCheckbox();
    });
});

$(".detail-kiosk").each(function (index) {
    $(this).change(function () {
        sendCheckedToSignalR($(this));
    });
});

$(".employee-kiosk").each(function (index) {
    $(this).change(function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        var kiosk = $("[name='IdKiosk']").val();
        serviceHub.server.setEmployeeForKiosk(kiosk, id, status);
    });
});



$(".employee-role").each(function (index) {
    $(this).change(function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        var employee = $("[name='IdEmployee']").val();
        serviceHub.server.setEmployeeForRole(employee, id, status);
    });
});

function sendCheckedToSignalR(_this) {
    if (!_this.hasClass("detail-kiosk")) return;
    var status = _this.is(":checked");
    var id = _this.attr("name");
    var kiosk = $("[name='IdKiosk']").val();
    serviceHub.server.setServiceForKiosk(kiosk, id, status);
    updateAllCheckbox();
}

function updateAllCheckbox() {
    $(".service-kiosk").each(function (index) {
        var id = $(this).attr("name");
        if ($(".detail-kiosk[service='" + id + "']").length < 1) $(this).prop("checked", false);
        else $(this).prop("checked", true);
    });
    $(".group-kiosk").each(function (index) {
        var id = $(this).attr("name");
        if ($(".detail-kiosk[group='" + id + "']").length < 1) $(this).prop("checked", false);
        else $(this).prop("checked", true);
    });

    $(".detail-kiosk").each(function (index) {
        if ($(this).prop("checked") == false) {
            var service = $(this).attr("service");
            var group = $(this).attr("group");
            $("#service-kiosk-" + service).prop("checked", false);
            $("#group-kiosk-" + group).prop("checked", false);
        }
    });
}

function kioskCommand(IdKiosk, IdCommand) {
    var msg = "Bạn có thực sự muốn ";
    if (IdCommand == 1) msg += "ngắt kết nối phiên làm việc";
    else if (IdCommand == 2) msg += "tắt"
    else if (IdCommand == 3) msg += "khởi động lại"
    else if (IdCommand == 4) msg += "tắt phần mềm"
    else if (IdCommand == 5) msg += "mở teamviewer"

    msg += " kiosk này hay không?";

    if (!confirm(msg)) return;

    serviceHub.server.setKioskCommand(IdKiosk, IdCommand);
}

$(document).ready(function () {
    updateAllCheckbox();
});