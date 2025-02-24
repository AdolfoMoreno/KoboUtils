const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const { processAnnotationsDir } = require('./modules/jsonProcessor');
const { processKoboReaderFile, processKoboReaderFileSQL } = require('./modules/sqlProcessor');
require('./modules/handlers/getBooks');
require('./modules/handlers/getQuotes');

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
ipcMain.handle('select-sqlite', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const folderPath = result.filePaths[0];
    const extractedData = processKoboReaderFileSQL(folderPath);
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
    const extractedData = processKoboReaderFile(folderPath, true);
    return extractedData;
  }

  return [];
});