const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Function to read and process KoboReader.sqlite file
function processKoboReaderFile(directory, isKobo) {
  const fileName = 'KoboReader.sqlite';
  let filePath = path.join(directory, fileName);

  if (isKobo) {
    // Change path to navigate to folder where file is located
  }

  if (!fs.existsSync(filePath)) {
    console.log('File does not exist or you found a bug!');
    return [];
  }

  console.log(`Processing file: ${filePath}`);

  const db = new sqlite3.Database(filePath, sqlite3.OPEN_READONLY);

  const query = `
    SELECT 
      Bookmark.VolumeID AS bookTitle, 
      Bookmark.Text AS text, 
      Bookmark.Annotation AS annotation
    FROM Bookmark
    WHERE Bookmark.Text IS NOT NULL OR Bookmark.Annotation IS NOT NULL
  `;

  let results = [];

  try {
    const stmt = db.prepare(query);
    stmt.all((err, rows) => {
      if (err) {
        throw err;
      }

      results = rows.map(row => ({
        title: row.bookTitle,
        text: row.text ? row.text.trim() : '',
        annotation: row.annotation ? row.annotation.trim() : ''
      }));
    });
    stmt.finalize();
  } catch (err) {
    console.error('Error reading database:', err);
  } finally {
    db.close();
  }

  return results;
}

module.exports = { processKoboReaderFile }; 