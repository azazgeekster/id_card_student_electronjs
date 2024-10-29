document
  .getElementById("bulkUpload")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission behavior
    const file = document.getElementById("fileInput").files[0];
    const reader = new FileReader();
    reader.onload = async function (event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const studentData = XLSX.utils.sheet_to_json(sheet);
      const CHUNK_SIZE = 250; // Define the chunk size

      // Function to split the data into chunks of a given size
      function chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
          chunks.push(array.slice(i, i + size));
        }
        return chunks;
      }

      // Split student data into chunks of 250
      const studentChunks = chunkArray(studentData, CHUNK_SIZE);

      for (const chunk of studentChunks) {
        const pdf = new jsPDF("l", "mm", [261, 165]); // Create a new PDF for each chunk

        for (const student of chunk) {
          console.log(`Processing image of ${student.prenom}`);
          
          // Skip if photo field is empty
          if (!student.photo) {
            console.log(`Skipping ${student.nom}'s photo due to empty photo field`);
            continue;
          }

          // Load image using student photo
          const img = new Image();
          img.src = `/images_etudiants/${student.photo}`;

          // Check if image loads successfully
          const imageLoadPromise = new Promise((resolve, reject) => {
            img.onload = function () {
              resolve(true);  // Image exists, resolve the promise
            };

            img.onerror = function () {
              console.log(`Skipping ${student.nom}'s photo because it does not exist`);
              resolve(false);  // Image doesn't exist, resolve as false
            };
          });

          const imageExists = await imageLoadPromise;

          // Skip this student if the image does not exist
          if (!imageExists) continue;

          // If the image exists, proceed to generate the card
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
            $("#card_photo").attr("src", img.src);

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
          console.error('Error generating PDF:', err);
        }
      }
    };

    reader.onerror = function (ex) {
      console.error(`excelError ${ex}`);
    };

    reader.readAsBinaryString(file);
  });
