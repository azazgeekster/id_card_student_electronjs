$(function () {
    
    $("#dossierForm").on("submit", function (e) {
        e.preventDefault();
        
        console.log("prevented");
        
        // Collect form data
        const dossierData = {
            prenom_ar: $("#prenom_ar_dossier").val(),
            nom_ar: $("#nom_ar_dossier").val(),
            prenom: $("#prenom_dossier").val(),
            nom: $("#nom_dossier").val(),
            cne: $("#cne_dossier").val(),
            cin: $("#cin_dossier").val(),
            apogee: $("#apogee_dossier").val(),
            n_dossier: $("#n_dossier_dossier").val(),
            date:`${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`,
        };
        dossierData.email = generateEmail(dossierData.prenom, dossierData.nom, dossierData.cin);


        
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



function generateEmail(prenom, nom, cin) {
  // Helper function to clean up strings
  const cleanString = (str) =>
      str.toLowerCase().replace(/[\s\-']/g, '');

  // Clean prenom and nom
  const cleanPrenom = cleanString(prenom);
  const cleanNom = cleanString(nom);

  // Extract the last two digits of CIN
  const lastTwoDigitsCin = cin.slice(-2);

  // Form the email
  const email = `${cleanPrenom}.${cleanNom}.${lastTwoDigitsCin}@edu.uiz.ac.ma`;

  return email;
}