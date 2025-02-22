const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const { processAnnotationsDir } = require('./modules/jsonProcessor');
const { processKoboReaderFile } = require('./modules/sqlProcessor');

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');
});

// Handle folder selection
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const folderPath = result.filePaths[0];
    const extractedData = processAnnotationsDir(folderPath);
    return extractedData;
  }

  return [];
});

// Handle folder selection
ipcMain.handle('select-kobo', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const folderPath = result.filePaths[0];
    const extractedData = processKoboReaderFile(folderPath);
    return extractedData;
  }

  return [];
});