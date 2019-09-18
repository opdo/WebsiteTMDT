var promotionHub = $.connection.promotionHub;
promotionHub.client.AlertMessage = function (text) {
    alert(text);
}
promotionHub.client.UpdateStatus = function (_class, id, status) {
    var checkbox = $("." + _class + "[name='" + id + "']");
    if (checkbox.length < 1) return;
    checkbox.prop('checked', status);

    if (_class == "promotion-detail") {
        var form = $(".form-discount[service=" + id + "]");
        if (status < 1) form.fadeOut();
        else form.fadeIn();
    }

}
promotionHub.client.UpdatePromotionDetail = function (id, discountCount, discountAdult, discountChildren) {
    var _discountCount = $("#DiscountCount-" + id);
    var _discountAdult = $("#DiscountAdult-" + id);
    var _discountChildren = $("#DiscountChildren-" + id);

    if (_discountCount.length > 0) _discountCount.val(discountCount);
    if (_discountAdult.length > 0) _discountAdult.val(discountAdult);
    if (_discountChildren.length > 0) _discountChildren.val(discountChildren);

    var form = $(".form-discount[service=" + id + "]");
    if (form.length > 0) form.show();

    var checkbox = $(".promotion-detail[name="+id+"]");
    if (form.length > 0) checkbox.prop('checked', true);

}

promotionHub.connection.start().done(function () { });


$(".promotion-kiosk").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        var promotion = $("[name='IdPromotion']").val();
        promotionHub.server.setPromotionForKiosk(promotion, id, status);
    });
});

$(".kiosk-promotion").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        var kiosk = $("[name='IdKiosk']").val();
        promotionHub.server.setPromotionForKiosk(id, kiosk, status);
    });
});

$(".discount-promotion-input").each(function (index) {
    $(this).on("change", function () {
        var id = $(this).attr("detail");
        SavePromotionDetail(id);
    });
});

$(".promotion-detail").each(function (index) {
    $(this).on("click", function () {
        var status = $(this).is(":checked");
        var id = $(this).attr("name");
        var form = $(".form-discount[service=" + id + "]");
        if (status == true) 
        {
            form.fadeIn();
            SavePromotionDetail(id);
        }
        else 
        {
            form.fadeOut();
            promotionHub.server.removePromotionDetail(id, $("[name='IdPromotion']").val());
        }
        
    });
});

function SavePromotionDetail(IdDetail) {
    var IdPromotion = $("[name='IdPromotion']").val();
    var DiscountCount = $("#DiscountCount-" + IdDetail).val();
    var DiscountAdult = $("#DiscountAdult-" + IdDetail).val();
    var DiscountChildren = $("#DiscountChildren-" + IdDetail).val();

    DiscountCount = DiscountCount == "" ? 0 : DiscountCount;
    DiscountAdult = DiscountAdult == "" ? 0 : DiscountAdult;
    DiscountChildren = DiscountChildren == "" ? 0 : DiscountChildren;

    promotionHub.server.addPromotionDetail(IdPromotion, IdDetail, DiscountCount, DiscountAdult, DiscountChildren);
}

function SetAllDetailPromotion() {
    var _discount = $("#discountAll").val();
    if (isNaN(_discount)) {
        alert("Phần trăm khuyến mãi phải là một con số");
        return;
    }
    var discount = parseInt(_discount);

    if (discount < 0 || discount > 100) {
        alert("Phần trăm khuyến mãi phải là số từ 0 đến 100");
        return;
    }

    if (!confirm("Bạn có thực sự muốn thiết lập cho toàn bộ dịch vụ giảm " + discount + "% hay không?")) return;

    var IdPromotion = $("[name='IdPromotion']").val();
    $(".promotion-detail").each(function (index) {
        var IdDetail = $(this).attr("name");
        promotionHub.server.addPromotionDetail(IdPromotion, IdDetail, discount, discount, discount);
    });

}

function _CheckAllPromotionForKiosk() {
    $(".promotion-kiosk").each(function (index) {
        var id = $(this).attr("name");
        var status = $(this).is(":checked");
        if (status == true) return;
        var promotion = $("[name='IdPromotion']").val();
        promotionHub.server.setPromotionForKiosk(promotion, id, true);
    });
}