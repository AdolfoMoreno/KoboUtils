const fs = require('fs');
const path = require('path');

// Function to read and process KoboReader.sqlite file
function processKoboReaderFile(directory) {
  const fileName = 'KoboReader.sqlite';
  const filePath = path.join(directory, fileName);

  if (fs.existsSync(filePath)) {
    console.log(`Processing file: ${filePath}`);
    // Your file processing logic here
  } else {
    console.log('File does not exist or you found a bug!');
  }
}

module.exports = { processKoboReaderFile }; 