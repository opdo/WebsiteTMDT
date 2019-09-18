var transactionHub = $.connection.transactionHub;

transactionHub.client.AlertMessage = function (text) {
    alert(text);
}

transactionHub.client.ConfirmComplete = function (idConfirm) {
    var row = $(".row-confirm[name=" + idConfirm + "]");
    if (row.length < 1) return;
    row.fadeOut().remove();
}

transactionHub.client.NewConfirm = function (html) {
    var table = $("#listConfirm");
    if (table.length < 1) return;
    $(html).hide().appendTo(table).fadeIn(500);
}


transactionHub.connection.start().done(function () { });


$('#listConfirm').delegate('.btn-transaction-confirm', 'click', function () {
    if (!confirm("Bạn có thực sự muốn XÁC NHẬN giao dịch này hay không?")) return;
    var id = $(this).attr("name");
    ConfirmTransaction(id, true);
});

$('#listConfirm').delegate('.btn-transaction-deny', 'click', function () {
    if (!confirm("Bạn có thực sự muốn TỪ CHỐI giao dịch này hay không?")) return;
    var id = $(this).attr("name");
    ConfirmTransaction(id, false);
});


function ConfirmTransaction(IdConfirm, Confirm) {
    transactionHub.server.confirmTransaction(IdConfirm, Confirm);
}