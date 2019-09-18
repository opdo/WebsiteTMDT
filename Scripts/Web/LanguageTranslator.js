var languageHub = $.connection.languageHub;
var languageCurrentDropdownListName = "";
var languageModal = $("#LanguageModal");

languageHub.client.Translator = function (idLanguage, Text) {
    var modal = $("#LanguageModal");
    if (modal == null) {
        return;
    }
    modal.find(".text-translator[name='" + idLanguage + "']").val(Text);
}
languageHub.client.AlertMessage = function (text) {
    alert(text);
}

languageHub.client.ListTranslator = function (text) {
    var list = JSON.parse(text);
    var html = "";
    var option = $("<option />");

    for (var i = 0, len = list.length; i < len; ++i) {
        var item = list[i];
        option.html(item.Text);
        option.val(item.IdText);
        html += option[0].outerHTML;
    }


    $("select.dropdownlist-translator").each(function (index) {
        var oldValue = $(this).val();
        $(this).html(html).selectpicker("refresh");
        $(this).val(oldValue);
        $(this).selectpicker("refresh");
    });
}
languageHub.client.SavedID = function (id) {
    if (languageCurrentDropdownListName == "") return;
    var select = $("select[name='" + languageCurrentDropdownListName + "']");
    select.val(id);
    select.selectpicker("refresh");
    languageCurrentDropdownListName = "";
}



languageHub.connection.start().done(function() { });

function _AutoTranslator(text) {
    if (text == "" || text == null) {
        alert("Vui lòng nhập bản dịch tiếng Việt trước khi thực hiện chức năng tự dịch");
        return;
    }

    if (!confirm("Bạn có muốn thực hiện chức năng tự dịch, bản dịch sẽ dịch bằng Google Dịch và phần mềm không chịu trách nhiệm về tính chính xác của bản dịch")) return;

    languageHub.server.autoTranslatorFromVietnamese(text);

}

function _Translator(nameElement, idTranslator) {
    var element = $("[name='" + nameElement + "']");
    if (element == null || languageModal == null) {
        alert("Không tìm thấy đối tượng khởi tạo, vui lòng tải lại trang hoặc liên hệ kỹ thuật viên nếu lỗi này vẫn còn hiển thị");
        return;
    }
    languageCurrentDropdownListName = nameElement;

    languageModal.find("[name='idText']").val(idTranslator == null ? "0" : idTranslator);

    $(".text-translator").each(function (index) {
        $(this).val("");
    });
    if (idTranslator != null) {
        if (idTranslator == "") {
            alert("Không tìm thấy bản dịch này, vui lòng chọn tạo mới để tạo một bản dịch");
            return;
        }
        languageHub.server.getTranslator(idTranslator);
    }

    languageModal.modal('show');
}

function _SaveTranslator(form) {

    var flagSave = false;
    var idText = form.find("[name='idText']").val();
    var data = [];

    $(".text-translator").each(function (index) {
        var item = {
            idText: form.find("[name='idText']").val(),
            idLanguage: $(this).attr("name"),
            Text: $(this).val()
        };
        data.push(item);
        if ($(this).val() != null && $(this).val() != "") {
            flagSave = true;
        }
        if ($(this).attr("name") == "2" && ($(this).val() == null || $(this).val() == "")) {
            flagSave = false;
            return;
        }
    });

    if (!flagSave) {
        alert("Vui lòng định nghĩa ít nhất một ngôn ngữ và bắt buộc phải định nghĩa tiếng Việt");
        return;
    }

    languageHub.server.saveTranslator(JSON.stringify(data));
    languageModal.modal('hide');

}