document
  .getElementById("bulkUpload")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission behavior
    // Read the selected Excel file
    const file = document.getElementById("fileInput").files[0];
    const reader = new FileReader();
    reader.onload = async function (event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const studentData = XLSX.utils.sheet_to_json(sheet);
      const pdf = new jsPDF("l", "mm", [261, 165]); // Create a new PDF in portrait mode

      for (const student of studentData) {
        await new Promise((resolve) => {
          $(".card_fname").html(student.prenom_ar);
          $(".card_lname").html(student.nom_ar);
          $(".card_fname_latin").html(student.prenon);
          $(".card_lname_latin").html(student.nom);
          $(".card_cne").html(student.cne);
          $(".card_case_number").html(student.n_dossier);
          $(".card_cin").html(student.cin);
          $(".card_diploma").html(student.filiere);
          $(".card_apogee").html(student.apogee);

          //   $("#card_photo").attr("src", `/images_etudiants/${student.cne}.png`);

          // Load image using student cne
          const img = new Image();
          img.src = `/images_etudiants/${student.photo}`;
          
          // img.src = `/images_etudiants/${student.photo} || /images_etudiants/person.png`;
          img.onload = async function () {
            $("#card_photo").attr("src", img.src);
            await html2canvas(document.getElementById("print-this")).then(
              (canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const imgWidth = 92;
                const pageHeight = 125;
                let imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                  position = heightLeft - imgHeight;
                  pdf.addPage();
                  pdf.addImage(
                    imgData,
                    "PNG",
                    0,
                    position,
                    imgWidth,
                    imgHeight
                  );
                  heightLeft -= pageHeight;
                }

                if (student !== studentData[studentData.length - 1]) {
                  pdf.addPage();
                }
                resolve();
              }
            );
          };
        });
      }
      window.open(pdf.output("bloburl"));
    };

    reader.onerror = function (ex) {
      console.error(`excelError ${ex}`);
    };

    reader.readAsBinaryString(file);
  });
