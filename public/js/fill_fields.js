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
            // console.log("fetched\n",jsonData[0].cne );
        })
        .catch(error => console.error('Error fetching or processing the Excel file:', error));

    // Handle keypress in the apogee field
        $('#apogee').on('input', function () {
            // console.log("ap is typing")

            const apogeeValue = this.value;
            console.log(jsonData[0].apogee==apogeeValue)
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
            console.log(jsonData[0].cne==cneValue)
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
});