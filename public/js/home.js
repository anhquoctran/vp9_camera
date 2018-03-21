//Disable Update and Delete button by default
$(document).ready(function() {
    $("#updatebtn").attr("disabled", "disabled")
    $("#deletebtn").attr("disabled", "disabled")
})

//Validation form using jQuery Validation Plugin
$("#frmInsert").validate();
$("#frmUpdate").validate();
$("#frmDelete").validate();

//Handle table checkbox click
$('input[type=radio]').change(
    function(){
        if ($(this).is(':checked') && $(this).val() == 'on') {
            $("#updatebtn").removeAttr("disabled")
            $("#deletebtn").removeAttr("disabled")
            var id = $(this).closest('td').next('td').html()
            var lastnameCol = $(this).closest('td').next('td').closest('td').next('td')
            var firstnameCol = lastnameCol.closest('td').next('td')
            var genderCol = firstnameCol.closest('td').next('td')
            var ageCol = genderCol.closest('td').next('td')

            $("#userId").val(id)
            $("#idUser").val(id);
            $("#firstnameEdit").val(firstnameCol.html())
            $("#lastnameEdit").val(lastnameCol.html())
            $("#genderEdit").val(genderCol.html() === "Nam" ? 0 : 1);
            $("#birthdayEdit").val(ageCol.html());
        }
        else {
            $("#updatebtn").attr("disabled", true)
            $("#deletebtn").attr("disabled", true)
        }
})

//Reload table content without reload entire page
function reload() {
    $.getJSON("/reload",
        function (data, textStatus, jqXHR) {
            $("#mytable").find("tr:gt(0)").remove();
            var trHtml = '<tr><th class="col-select">Chọn</th><th>Số thứ tự</th><th>Mã người dùng</th><th>Họ</th><th>Tên</th> <th>Giới tính</th><th>Tuổi</th>';
            var index = 1;
            $.each(data.result, function(i, item) {
                trHtml += '</tr><tr><td style="width: 40px"><input type="radio" id="row'+ item.id + '" name="check" class="check"></td><td>'+ index +'</td><td>' + item.id + '</td><td>' + item.lastname + '</td><td>' + item.firstname + '</td><td>' + (item.gender === 0 ? "Nam" : "Nữ") + '</td><td>' + item.birthday + '</td></tr>'
                index++;
            })
            $("#mytable").html(trHtml)
        }
    )
}

$("#reloadLink").click(function(e) {
    e.preventDefault()
    reload()
})