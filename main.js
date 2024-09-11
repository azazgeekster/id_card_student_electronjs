// main.js
const { app, BrowserWindow } = require('electron');
const express = require('express');
const path = require('path');

let mainWindow;

function createWindow() {
  const server = express();
  const port = 1337;

  server.use(express.static(path.join(__dirname, 'public')));
 
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

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

