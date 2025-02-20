const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');

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

// Function to parse a single XML file and extract data
function parseXmlFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return new Promise((resolve, reject) => {
    xml2js.parseString(fileContent, (err, jsonData) => {
      if (err) {
        reject(`Error parsing XML file: ${filePath}`);
        return;
      }

      try {
        // Extract the book title
        const title = jsonData.annotationSet.publication[0]['dc:title'][0];

        // Extract annotation texts
        const annotationTexts = jsonData.annotationSet.annotation.map(annotation => {
          return annotation.target[0].fragment[0].text[0].trim();
        });

        // Convert each annotation into an entry
        const results = annotationTexts.map(text => ({
          title,
          text
        }));

        resolve(results);
      } catch (error) {
        reject(`Error extracting data from XML: ${filePath} - ${error.message}`);
      }
    });
  });
}

// Function to process all .annot (XML) files in a directory
async function processAnnotationsDir(directory) {
  try {
    const files = fs.readdirSync(directory);
    const annotFiles = files.filter(file => file.endsWith('.annot'));

    // Convert all XML files to JSON and extract relevant data
    const allResults = await Promise.all(
      annotFiles.map(file => parseXmlFile(path.join(directory, file)))
    );

    // Flatten the array of arrays
    return allResults.flat();
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
    try {
      const extractedData = await processAnnotationsDir(folderPath);
      return extractedData;
    } catch (error) {
      console.error('Error extracting annotations:', error);
      return [];
    }
  }

  return [];
});
