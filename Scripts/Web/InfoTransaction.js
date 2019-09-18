var transactionHub = $.connection.transactionHub;

transactionHub.client.AlertMessage = function (text) {
    alert(text);
}

transactionHub.connection.start().done(function () { });

function _TransactionUpdate(ButtonID, IdTransaction, Status) {
    // với status = 1 là update success, status = 2 là update fail và status = 3 là fail nhưng có hoàn tiền
    if (!confirm("Bạn có chắc chắn muốn cập nhật giao dịch này hay không?")) return;

    var button = $("#" + ButtonID);
    var oldText = button.html();
    button.html('<i class="fa fa-refresh fa-spin fa-fw"></i> Vui lòng đợi');
    button.prop("disabled", true);

    var Reason = "Cập nhật bằng web";
    if (Status == 2 || Status == 3) {
        Reason = prompt("Vui lòng điền lý do hủy");
        if (Reason === null) {
            return; //break out of the function early
        }

    }
    transactionHub.server.transactionUpdate(IdTransaction, Status, Reason).done(function (result) {
        if (result == true) location.reload();
        button.html(oldText);
        button.prop("disabled", false);
    });

}

function _SendMailTicket(ButtonID, IdTransaction) {
    var button = $("#" + ButtonID);
    var oldText = button.html();
    button.html('<i class="fa fa-refresh fa-spin fa-fw"></i> Vui lòng đợi');
    button.prop("disabled", true);

    transactionHub.server.sendMailTicket(IdTransaction).done(function (result) {
        if (result == true) location.reload();
        button.html(oldText);
        button.prop("disabled", false);
    });
}


function _TransactionCheck(ButtonID, IdTransaction) {
    var button = $("#" + ButtonID);
    var oldText = button.html();
    button.html('<i class="fa fa-refresh fa-spin fa-fw"></i> Vui lòng đợi');
    button.prop("disabled", true);

    transactionHub.server.transactionCheck(IdTransaction).done(function (result) {
        if (result == true) location.reload();
        button.html(oldText);
        button.prop("disabled", false);
    });
}

$("#IdGroup").change(function () {
    var id = $("#IdGroup").val();
    _TransactionGetListServiceByGroup(id);
});


$("#IdGroup").change(function () {
    var id = $("#IdGroup").val();
    _TransactionGetListServiceByGroup(id);
});


$("#IdServiceSeatMap").change(function () {
    _LoadShowTime();
});
$("#DateSeatMap").change(function () {
    _LoadShowTime();
});



function _LoadShowTime() {
    var idService = $("#IdServiceSeatMap").val();
    var date = $("#DateSeatMap").val();
    var idShowTime = $("#IdShowTimeSeatMap");
    if (date == '' || idService == '') {
        idShowTime.html('').selectpicker("refresh");
        return;
    }
    transactionHub.server.seatMapGetShowTime(idService, date).done(function (result) {
        idShowTime.html(result).selectpicker("refresh");
    });
    
}

function _TransactionGetListServiceByGroup(IdGroup) {
    var html = "";
    var _select = $("#IdService");

    if (IdGroup == null || IdGroup == 0 || IdGroup == "") {
        html = "";
        _select.val(null);
        var oldValue = _select.val();
        _select.html(html).selectpicker("refresh");
        _select.val(oldValue);
        _select.selectpicker("refresh");
    }
    else {
        transactionHub.server.transactionGetListServiceByGroup(IdGroup).done(function (list) {
            //var list = JSON.parse(result);
            var option = $("<option />");

            for (var i = 0, len = list.length; i < len; ++i) {
                var item = list[i];
                option.html(item.Text);
                option.val(item.Value);
                html += option[0].outerHTML;
            }

            var oldValue = _select.val();
            _select.html(html).selectpicker("refresh");
            _select.val(oldValue);
            _select.selectpicker("refresh");
        });
    }



}