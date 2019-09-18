var serviceHub = $.connection.serviceHub;
var kioskHub = $.connection.KioskHub;

serviceHub.client.AlertMessage = function (text) {
    alert(text);
}
serviceHub.client.UpdateStatus = function (_class, id, status) {
    var checkbox = $("." + _class + "[name='" + id + "']");
    if (checkbox.length < 1) return;
    checkbox.prop('checked', status);
}

kioskHub.client.KioskOnline = function (id, status) {
    var kioskEm = $("[name='online-kiosk-" + id + "']");
    if (kioskEm.length < 1) return;
    if (status == 1) kioskEm.fadeIn();
    else kioskEm.fadeOut();
}

serviceHub.client.ReloadPage = function (text) {
    location.reload();
}

serviceHub.client.SyncDataButtonText = function (text) {
    var button = $("#SyncData");
    if (button.length < 1) return;
    button.html('<i class="fa fa-refresh fa-spin fa-fw"></i> ' + text);
    button.prop("disabled", true);
}

serviceHub.connection.start().done(function () { });


$(".group-status").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        serviceHub.server.setGroupStatus(id, status);
    });
});

$(".service-status").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        serviceHub.server.setServiceStatus(id, status);
    });
});

$(".detail-status").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        serviceHub.server.setDetailStatus(id, status);
    });
});

$(".detail-confirm").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        serviceHub.server.setDetailConfirm(id, status);
    });
});

$(".promotion-status").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        serviceHub.server.setPromotionStatus(id, status);
    });
});

$(".employee-status").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        serviceHub.server.setEmployeeStatus(id, status);
    });
});


$(".kiosk-status").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        serviceHub.server.setKioskStatus(id, status);
    });
});


$(".btn-delete-kiosk").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        if (confirm("Bạn có thực sự muốn xóa Kiosk này hay không?") == true) {
            serviceHub.server.deleteKiosk(id);
        }
    });
});

$(".btn-delete-promotion").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        if (confirm("Bạn có thực sự muốn xóa chương trình khuyến mãi này hay không?") == true) {
            serviceHub.server.deletePromotion(id);
        }
    });
});

$(".btn-delete-employee").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        if (confirm("Bạn có thực sự muốn xóa nhân viên này hay không?") == true) {
            serviceHub.server.deleteEmployee(id);
        }
    });
});

$(".btn-delete-service").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        if (confirm("Bạn có thực sự muốn xóa dịch vụ này hay không?") == true) {
            serviceHub.server.deleteService(id);
        }
    });
});

$(".btn-delete-group").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        if (confirm("Bạn có thực sự muốn xóa nhóm dịch vụ này hay không?") == true) {
            serviceHub.server.deleteGroup(id);
        }
    });
});

$(".btn-delete-seat").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        if (confirm("Bạn có thực sự muốn xóa sơ đồ ghế này hay không?") == true) {
            serviceHub.server.deleteSeat(id);
        }
    });
});

$(".btn-delete-detail").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        if (confirm("Bạn có thực sự muốn xóa chi tiết dịch vụ này hay không?") == true) {
            serviceHub.server.deleteServiceDetail(id);
        }
    });
});

$(".btn-delete-text").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        if (confirm("Bạn có thực sự muốn xóa bảng dịch thuật này hay không?") == true) {
            serviceHub.server.deleteText(id);
        }
    });
});

function _CreateSeatMap() {
    var name = $("#seatmapName").val();
    var row = $("#seatmapRow").val();
    var col = $("#seatmapCol").val();
    if (name == '' || name == null || row == '' || row == null || col == '' || col == null) {
        alert("Vui lòng nhập đầy đủ thông tin bên trên");
        return;
    }
    if (row <= 0 || row > 50 || col <= 0 || col > 50) {
        alert("Số dòng, số cột phải nằm trong đoạn từ 1 đến 50");
        return;
    }
    serviceHub.server.createSeatMap(name, row, col);
}

function _SyncData() {
    var button = $("#SyncData");
    if (button.length < 1) return;
    button.html('<i class="fa fa-refresh fa-spin fa-fw"></i> Đang đồng bộ, vui lòng đừng tắt cửa sổ này');
    button.prop("disabled", true);
    serviceHub.server.syncData().done(function (message) {
        alert(message);
        button.html('<i class="fa fa-refresh"></i> Đồng bộ dữ liệu');
        button.prop("disabled", false);
    });
}

function _ScanSignal() {
    var button = $("#ScanSignal");
    if (button.length < 1) return;

    var _delete = false;
    if (confirm("Bạn có muốn refesh lại toàn bộ tín hiệu không?\nViệc refesh lại tín hiệu sẽ xóa trạng thái online trên web đế kiosk kết nối lại, và KHÔNG ảnh hưởng đến các hoạt động của khách hàng trên kiosk")) _delete = true;
    button.html('<i class="fa fa-refresh fa-spin fa-fw"></i> Đang quét lại, vui lòng đừng tắt cửa sổ này');
    button.prop("disabled", true);

    kioskHub.server.scanSignal(_delete).done(function (message) {
        alert(message);
        button.html('<i class="fa fa-bullseye"></i> Quét lại tín hiệu');
        button.prop("disabled", false);
    });
}

$(".seatmap").each(function (index) {
    $(this).on("change", function () {
        var id = $(this).attr("id-seat");
        var name = $(this).val();
        if (name == null) name = '';
        serviceHub.server.saveSeatName(id, name);
    });
});