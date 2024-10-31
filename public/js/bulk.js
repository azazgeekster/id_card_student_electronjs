document.getElementById("bulkUpload").addEventListener("submit", async function (e) {
  e.preventDefault();
  const file = document.getElementById("fileInput").files[0];
  const reader = new FileReader();

  reader.onload = async function (event) {
    const data = event.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const studentData = XLSX.utils.sheet_to_json(sheet);
    const CHUNK_SIZE = 250;

    function chunkArray(array, size) {
      const chunks = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    }

    const studentChunks = chunkArray(studentData, CHUNK_SIZE);
    const possibleExtensions = [".jpg", ".jpeg", ".png"];

    for (const chunk of studentChunks) {
      const pdf = new jsPDF("l", "mm", [261, 165]);

      for (const student of chunk) {
        console.log(`Processing image of ${student.prenom}`);

        let imageExists = false;
        let imgSrc = "";

        // Try each possible extension until an image is found
        for (const ext of possibleExtensions) {
          imgSrc = `/images_etudiants/${student.cne}${ext}`;
          const img = new Image();
          img.src = imgSrc;

          // Check if image loads successfully
          imageExists = await new Promise((resolve) => {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
          });

          if (imageExists) break; // Stop if we found an existing image
        }

        if (!imageExists) {
          console.log(`Skipping ${student.nom} ${student.prenom}'s photo as no valid image found`);
          continue;
        }

        qrcode.clear(); // Clears the existing QR code

        // Set up the card information and generate QR code
        await new Promise((resolve) => {
          $(".card_fname").html(student.prenom_ar);
          $(".card_lname").html(student.nom_ar);
          $(".card_lname_latin").html(student.nom);
          $(".card_fname_latin").html(student.prenom);
          $(".card_cne").html(student.cne);
          $(".card_case_number").html(student.n_dossier);
          $(".card_cin").html(student.cin);
          $(".card_diploma").html(student.filiere);
          $(".card_apogee").html(student.apogee);
          $("#card_photo").attr("src", imgSrc);
          qrcode.makeCode(student.cne);
          console.log("printing qrcode: ", student.cne);

          html2canvas(document.getElementById("print-this")).then((canvas) => {
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
              pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
            }

            if (student !== chunk[chunk.length - 1]) {
              pdf.addPage();
            }
            resolve();
          });
        });
      }

      // Open or save the generated PDF for this chunk
      try {
        window.open(pdf.output("bloburl"));
      } catch (err) {
        console.error("Error generating PDF:", err);
      }
    }
  };

  reader.onerror = function (ex) {
    console.error(`excelError ${ex}`);
  };

  reader.readAsBinaryString(file);
});
