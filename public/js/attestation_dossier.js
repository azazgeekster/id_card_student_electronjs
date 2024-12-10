$(function () {
    
    $("#dossierForm").on("submit", function (e) {
        e.preventDefault();
        
        console.log("prevented");
        
        // Collect form data
        const dossierData = {
            fname_ar: $("#prenom_ar_dossier").val(),
            lname_ar: $("#nom_ar_dossier").val(),
            fname: $("#prenom_dossier").val(),
            lname: $("#nom_dossier").val(),
            cne: $("#cne_dossier").val(),
            cin: $("#cin_dossier").val(),
            apogee: $("#apogee_dossier").val(),
            dossier_number: $("#n_dossier_dossier").val(),
        };

        
        fetch('http://localhost:1337/gendoc', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dossierData)
          })
          .then(response => response.blob())
          .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            
            return response.blob();
          })
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'generated_dossier.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url); // Clean up URL
          })
          .catch(error => {
            console.error('Error generating document:', error);
          });
    });
});

