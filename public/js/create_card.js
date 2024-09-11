$(document).ready(function () {
  $("#form").on("submit", function (e) {
    // Prevent default form submission behavior
    e.preventDefault();

    // Collect form data
    const formData = {
      fname: $("#fname").val(),
      lname: $("#lname").val(),
      fname_ar: $("#fname_ar").val(),
      lname_ar: $("#lname_ar").val(),
      diploma: $("#diploma").val(),
      cin: $("#cin").val(),
      cne: $("#cne").val(),
      case_number: $("#case_number").val(),
      photo: $("#photo").val(),
      apogee: $("#apogee").val(),
    };

    // Update UI elements
    $("#modalForm").css("display", "none");
    $(".modal-backdrop").remove();
    $(".card_fname").html(formData.fname_ar);
    $(".card_lname").html(formData.lname_ar);
    $(".card_fname_latin").html(formData.fname);
    $(".card_lname_latin").html(formData.lname);
    $(".card_cne").html(formData.cne);
    $(".card_case_number").html(formData.case_number);
    $(".card_cin").html(formData.cin);
    $(".card_diploma").html(formData.diploma);
    $(".card_apogee").html(formData.apogee);

    // Format and set the date
    // const formattedDate = formData.date.split("-").reverse().join("/");
    // if(formattedDate) $(".card_date").html(formattedDate);

    // Generate QR code
    qrcode.clear(); // Clears the existing QR code
    qrcode.makeCode(formData.cne); // Generates a new QR code with the new text
  });
});

$("#photo").on("change", function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const fileContent = event.target.result;
    $("#card_photo").attr("src", fileContent);
  };
  reader.readAsDataURL(file);
});
