document.addEventListener('DOMContentLoaded', function () {
    // URL to the Excel file on your server
    const excelFileUrl = '../db.xlsx';

    let jsonData = [];

    // Fetch the Excel file
    fetch(excelFileUrl)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            jsonData = XLSX.utils.sheet_to_json(worksheet);
        })
        .catch(error => console.error('Error fetching or processing the Excel file:', error));


    $('#apogee').on('input', function () {
        // console.log("ap is typing")

        const apogeeValue = this.value;
        console.log(jsonData[0].apogee == apogeeValue)
        // Check if apogee value length is 10
        if (apogeeValue.length == 8) {
            let record = jsonData.find(item => item.apogee == apogeeValue);


            if (record) {
                console.log("record ok ", record['prenom'])
                $("#fname").val(record['prenom'] || 'NA');
                $("#lname").val(record['nom'] || 'NA');
                $("#lname_ar").val(record['nom_ar'] || 'NA');
                $("#fname_ar").val(record['prenom_ar'] || 'NA');
                $("#cne").val(record['cne'] || 'NA');
                $("#cin").val(record['cin'] || 'NA');
                $("#case_number").val(record['n_dossier'] || 'NA');
                $("#diploma").val(record['filiere'] || 'NA');

                // Add more fields as needed
            } else {
                console.log('No record found for apogee:', apogeeValue);
            }
        }
    });

    $('#cne').on('input', function () {
        // console.log("cne is typing")
        const cneValue = this.value;
        console.log(jsonData[0].cne == cneValue)
        if (cneValue.length == 10) {
            let record = jsonData.find(item => item.cne == cneValue);


            if (record) {
                console.log("record ok ", record['prenom'])
                $("#fname").val(record['prenom'] || 'NA');
                $("#lname").val(record['nom'] || 'NA');
                $("#lname_ar").val(record['nom_ar'] || 'NA');
                $("#fname_ar").val(record['prenom_ar'] || 'NA');
                $("#apogee").val(record['apogee'] || 'NA');
                $("#cin").val(record['cin'] || 'NA');
                $("#case_number").val(record['n_dossier'] || 'NA');
                $("#diploma").val(record['filiere'] || 'NA');

                // Add more fields as needed
            } else {
                console.log('No record found for cne:', cneValue);
            }
        }
    });



    // Handle keypress in the apogee field for Dossier form
    $('#apogee_dossier').on('input', function () {
        const apogeeValue = this.value;

        if (apogeeValue.length == 8) {
            let record = jsonData.find(item => item.apogee == apogeeValue);

            if (record) {
                $("#prenom_ar_dossier").val(record['prenom_ar'] || 'NA');
                $("#nom_ar_dossier").val(record['nom_ar'] || 'NA');
                $("#prenom_dossier").val(record['prenom'] || 'NA');
                $("#nom_dossier").val(record['nom'] || 'NA');
                $("#cne_dossier").val(record['cne'] || 'NA');
                $("#cin_dossier").val(record['cin'] || 'NA');
                $("#n_dossier_").val(record['n_dossier'] || 'NA');
            } else {
                console.log('No record found for apogee:', apogeeValue);
            }
        }
    });

    // Handle keypress in the cne field for Dossier form
    $('#cne_dossier').on('input', function () {
        const cneValue = this.value;

        if (cneValue.length == 10) {
            let record = jsonData.find(item => item.cne == cneValue);

            if (record) {
                $("#prenom_ar_dossier").val(record['prenom_ar'] || 'NA');
                $("#nom_ar_dossier").val(record['nom_ar'] || 'NA');
                $("#prenom_dossier").val(record['prenom'] || 'NA');
                $("#nom_dossier").val(record['nom'] || 'NA');
                $("#apogee_dossier").val(record['apogee'] || 'NA');
                $("#cin_dossier").val(record['cin'] || 'NA');
                $("#n_dossier_dossier").val(record['n_dossier'] || 'NA');
            } else {
                console.log('No record found for cne:', cneValue);
            }
        }
    });

    // Handle keypress in the apogee field for Attestation form
    $('#apogee_attestation').on('input', function () {
        const apogeeValue = this.value;

        if (apogeeValue.length == 8) {
            let record = jsonData.find(item => item.apogee == apogeeValue);

            if (record) {
                $("#prenom_ar_attestation").val(record['prenom_ar'] || 'NA');
                $("#nom_ar_attestation").val(record['nom_ar'] || 'NA');
                $("#prenom_attestation").val(record['prenom'] || 'NA');
                $("#nom_attestation").val(record['nom'] || 'NA');
                $("#cne_attestation").val(record['cne'] || 'NA');
                $("#cin_attestation").val(record['cin'] || 'NA');
                // $("#date_naissance").val(record['date_naissance'] || 'NA');
                if (record['date_naissance']) {
                    // Ensure date is in YYYY-MM-DD format
                    let formattedDate = new Date(record['date_naissance']);
                    if (!isNaN(formattedDate.getTime())) { // Check if it's a valid date
                        let formattedDateString = formattedDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
                        $("#date_naissance").val(formattedDateString);
                    } else {
                        $("#date_naissance").val(''); // If invalid date, clear the field
                    }
                } else {
                    $("#date_naissance").val(''); // If no date is provided, clear the field
                }
            } else {
                console.log('No record found for apogee:', apogeeValue);
            }
        }
    });

    // Handle keypress in the cne field for Attestation form
    $('#cne_attestation').on('input', function () {
        const cneValue = this.value;

        if (cneValue.length == 10) {
            let record = jsonData.find(item => item.cne == cneValue);

            if (record) {
                $("#prenom_ar_attestation").val(record['prenom_ar'] || 'NA');
                $("#nom_ar_attestation").val(record['nom_ar'] || 'NA');
                $("#prenom_attestation").val(record['prenom'] || 'NA');
                $("#nom_attestation").val(record['nom'] || 'NA');
                $("#apogee_attestation").val(record['apogee'] || 'NA');
                $("#cin_attestation").val(record['cin'] || 'NA');
                $("#date_naissance").val(record['date_naissance'] || 'NA');
            } else {
                console.log('No record found for cne:', cneValue);
            }
        }
    });
});
