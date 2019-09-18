function readURL(input, previewname) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var preview = $('#' + previewname);
            preview.css('background-image', 'url(' + e.target.result + ')');
            preview.hide();
            preview.fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#groupImage").change(function () {
    readURL(this, "imagePreview");
});

$("#groupImagePrint").change(function () {
    readURL(this, "imagePreview2");
});