const fs = require('fs');
const path = require('path');

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

module.exports = { processAnnotationsDir }; 