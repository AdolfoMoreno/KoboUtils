const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

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

// Function to read and process .annot files
function processAnnotationsDir(directory) {
  try {
    const files = fs.readdirSync(directory);
    const annotFiles = files.filter(file => file.endsWith('.annot'));

    const results = annotFiles.flatMap(file => {
      const filePath = path.join(directory, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);

      const title = jsonData.annotationSet.publication[0]['dc:title'][0];

      return jsonData.annotationSet.annotation.map(annotation => ({
        title,
        text: annotation.target[0].fragment[0].text[0],
      }));
    });

    return results;
  } catch (err) {
    console.error('Error processing files:', err);
    return [];
  }
}

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
