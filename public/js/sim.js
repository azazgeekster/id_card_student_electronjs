let jsonData = [];

    // Fetch the Excel file
    fetch('../db.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            jsonData = XLSX.utils.sheet_to_json(worksheet);
        })
        .catch(error => console.error('Error fetching or processing the Excel file:', error));

    // Function to generate the printable content
    document.getElementById('generateBtn').addEventListener('click', function () {
        const cne = document.getElementById('cne').value.trim();
        const simCode = document.getElementById('sim_code').value.trim();
        const record = jsonData.find(item => item.cne === cne);

        if (record) {
            // Populate modal fields with data
            document.getElementById('print-name').textContent = `${record.prenom} ${record.nom}`;
            document.getElementById('print-cne').textContent = record.cne;
            document.getElementById('print-cin').textContent = record.cin;
            document.getElementById('print-barcode').textContent = simCode;
            document.getElementById('print-date').textContent = new Date().toLocaleDateString('fr-FR');

            // Show the modal
            new bootstrap.Modal(document.getElementById('sim_modal')).show();
        } else {
            alert('No record found for the provided CNE.');
        }
    });

    // Function to print the content
    function printContent() {
        const printContent = document.getElementById('print-content').innerHTML;
        const newWindow = window.open('', '', 'height=600,width=800');
    
        newWindow.document.write`
            <html>
            <head>
                <title>Print</title>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/5.3.0/css/bootstrap.min.css">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    h4 {
                        text-align: center;
                    }
                    .text-end {
                        text-align: right;
                    }
                    .fw-bold {
                        font-weight: bold;
                    }
                        .modal-body{
                            margin-top:50px;
                        }

                        .title_sim{
                        margin-top:40px; text-align:center; margin-bottom:80px}
                        .header_sim{
                            text-align:center
                        }
                </style>
            </head>
            <body>
                ${printContent}
            </body>
            </html>
        `;
    
        newWindow.document.close();
        newWindow.print();
    }
    