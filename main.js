const { app, BrowserWindow } = require('electron');
const express = require('express');
 
// Load PizZip library to load the docx/pptx/xlsx file in memory
const Handlebars = require('handlebars');
const JSZip = require('jszip');

// Builtin file system utilities
const fs = require("fs");
const path = require("path");





let mainWindow;

const server = express();
const port = 1337;

// Parse incoming JSON bodies
server.use(express.json());

// Static file serving
server.use(express.static(path.join(__dirname, 'public')));

 
// Define the route before starting the server
// server.post('/gendoc', async (req, res) => {
//   const formData = req.body;
  
//   const docxFile = `./public/output-${Date.now()}.docx`;
//   const pdfFile = `./public/output-${Date.now()}.pdf`;
  
//   try {
//     if (!fs.existsSync('./public/vivid.docx')) {
//       console.error('Template file not found!');
//       return res.status(500).send('Template file not found.');
//     }
    
//     // Generate the Word document
//     await replacePlaceholders('./public/vivid.docx', formData, docxFile);
    
//     // return res.status(200).send({"docxFile":docxFile, "pdfFile":pdfFile});
//     // Convert to PDF
//     await docxToPdf(docxFile, pdfFile);

//     // Send PDF as a download response
//     res.setHeader('Content-Type', 'application/pdf');
//     res.download(pdfFile, 'dossier.pdf', (err) => {
//       if (err) {
//         console.error('Error sending file:', err);
//         res.status(500).send('Error generating or sending the PDF file.');
//       } else {
//         setTimeout(() => {
//           fs.unlinkSync(docxFile);
//           fs.unlinkSync(pdfFile);
//         }, 5000);
//       }
//     });
//   } catch (error) {
//     console.error('Error processing dossier:', error);
//     res.status(500).json({ message: 'Error generating dossier', error });
//   }
// });

server.post('/gendoc', async (req, res) => {
  const formData = req.body;

  // Generate a unique filename for the output
  const outputDocx = `./output-${Date.now()}.docx`;

  try {
    // Ensure the template file exists
    if (!fs.existsSync('./public/vivid.docx')) {
      console.error('Template file not found!');
      return res.status(500).send('Template file not found.');
    }

    // Generate the Word document by replacing placeholders
    await replacePlaceholders('./public/vivid.docx', formData, outputDocx);

    // Send the generated .docx file as a download response
    res.download(outputDocx, 'generated_dossier.docx', (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Error generating or sending the .docx file.');
      } 
      // else {
      //   // Optional: Clean up the generated file after sending
      //   setTimeout(() => {
      //     if (fs.existsSync(outputDocx)) {
      //       fs.unlinkSync(outputDocx);
      //     }
      //   }, 5000);
      // }
    });
  } catch (error) {
    console.error('Error processing dossier:', error);
    res.status(500).json({ message: 'Error generating dossier', error });
  }
});


// Start the Express server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Create the Electron window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(`http://localhost:${port}`);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});



const readDocxTemplate = (filePath) => {
  return fs.promises.readFile(filePath).then((content) => {
      return new JSZip().loadAsync(content);
  });
};

// Replace placeholders in the template
const replacePlaceholders = async (templatePath, data, outputPath) => {
  try {
    const zip = await readDocxTemplate(templatePath);

    if (!zip.file('word/document.xml')) {
      throw new Error('Template is missing the document.xml file!');
    }

    // Process the 'word/document.xml' file
    const documentXml = await zip.file('word/document.xml').async('string');
    const template = Handlebars.compile(documentXml);

    // Replace placeholders with data
    const updatedXml = template(data);

    // Update the Word document
    zip.file('word/document.xml', updatedXml);

    // Save the updated document
    const buffer = await zip.generateAsync({ type: 'nodebuffer' });
    await fs.promises.writeFile(outputPath, buffer);
    if (!fs.existsSync(outputPath)) {
      console.error('File not generated:', outputPath);
    }
    console.log(`Saving document to: ${path.resolve(outputPath)}`);
    console.log(`Word document generated: ${outputPath}`);

  } catch (error) {
    console.error('Error generating Word document:', error);
    throw error; // Propagate the error to handle it at the route level
  }
};
 