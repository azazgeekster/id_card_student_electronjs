$(document).ready(function () {
  // let canEdit = false;

  // Handle form submission
  let uploadedPhoto = "images/person.jpg"; // Default image

  // Capture the uploaded photo and convert to a data URL
  $("#photo").on("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        uploadedPhoto = e.target.result; // Store the data URL of the uploaded photo
        $("#card_photo").attr("src", uploadedPhoto); // Display the uploaded photo
      };
      reader.readAsDataURL(file); // Convert file to data URL
    } else {
      uploadedPhoto = "images/person.jpg"; // Reset to default if no file
      $("#card_photo").attr("src", uploadedPhoto);
    }
  });

  // Handle form submission
  $("#form").on("submit", function (e) {
    e.preventDefault();

    const formData = {
      fname: $("#fname").val(),
      lname: $("#lname").val(),
      fname_ar: $("#fname_ar").val(),
      lname_ar: $("#lname_ar").val(),
      diploma: $("#diploma").val(),
      cin: $("#cin").val(),
      cne: $("#cne").val(),
      case_number: $("#case_number").val(),
      apogee: $("#apogee").val(),
      photo: uploadedPhoto, // Include the photo URL
    };

    // Hide the modal and update card details
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

    // Set the photo in the image container
    $("#card_photo").attr("src", formData.photo || "images/person.jpg");

    // Generate QR code
    qrcode.clear(); // Clears the existing QR code
    qrcode.makeCode(formData.cne); // Generates a new QR code with the new text

    // Switch the button to "Edit Card"
    $("#createCardBtn").text("تعديل المعطيات");
  });

  // Handle switching to "Edit Card"
  $("#createCardBtn").on("click", function () {
      // Pre-fill the form with existing card data for editing
      $("#fname").val($(".card_fname_latin").text());
      $("#lname").val($(".card_lname_latin").text());
      $("#fname_ar").val($(".card_fname").text());
      $("#lname_ar").val($(".card_lname").text());
      $("#diploma").val($(".card_diploma").text());
      $("#cin").val($(".card_cin").text());
      $("#cne").val($(".card_cne").text());
      $("#case_number").val($(".card_case_number").text());
      $("#apogee").val($(".card_apogee").text());
      qrcode.clear(); // Clears the existing QR code
      qrcode.makeCode($("#cne").val()); // Generates a new QR code with the new text
  
      // Show the modal for editing
      $("#modalForm").modal("show");
   
  });
});
