const fs = require('fs');
const { app } = require('electron');
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
    stmt.all((err, rows) => { // this is an async function this needs to change to a promise
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

function processKoboReaderFileSQL(directory) {
  // const userDBPath = path.join(app.getPath('userData'), '..', 'kobo_utils_db.sqlite'); // Save database in user data folder
  const userDBPath = path.join(__dirname, '..', 'kobo_utils_db.sqlite'); // Save database in user data folder

  console.log('Database stored at:', userDBPath);
  return new Promise((resolve, reject) => {
    const fileName = 'KoboReader.sqlite';
    const filePath = path.join(directory, fileName);

    if (!fs.existsSync(filePath)) {
      console.log('File does not exist or you found a bug!');
      return resolve([]); // Avoid app crash
    }

    const koboDB = new sqlite3.Database(filePath, sqlite3.OPEN_READONLY);
    const userDB = new sqlite3.Database(userDBPath);

    const query = `
      SELECT 
        Bookmark.VolumeID AS bookTitle, 
        Bookmark.Text AS text, 
        Bookmark.Annotation AS annotation
      FROM Bookmark
      WHERE Bookmark.Text IS NOT NULL OR Bookmark.Annotation IS NOT NULL
    `;

    koboDB.all(query, [], (err, rows) => {
      if (err) {
        console.error('Error reading database:', err);
        koboDB.close();
        userDB.close();
        return reject(err);
      }

      const results = rows.map(row => ({
        title: row.bookTitle,
        text: row.text ? row.text.trim() : '',
        annotation: row.annotation ? row.annotation.trim() : ''
      }));

      const insertBook = userDB.prepare(`INSERT INTO books (title) VALUES (?) ON CONFLICT(title) DO NOTHING`);
      const insertQuote = userDB.prepare(`INSERT INTO quotes (book_id, text, color) VALUES (?, ?, NULL)`);
      const insertComment = userDB.prepare(`INSERT INTO comments (quote_id, text) VALUES (?, ?)`);

      rows.forEach(({ bookTitle, text, annotation }) => {
        // Insert book and get book_id
        insertBook.run(bookTitle);
        userDB.get(`SELECT id FROM books WHERE title = ?`, [bookTitle], (err, book) => {
          if (book) {
            insertQuote.run(book.id, text, function () {
              const quoteId = this.lastID; // Get quote_id after insertion
              if (annotation) {
                insertComment.run(quoteId, annotation);
              }
            });
          }
        });
      });

      insertBook.finalize();
      insertQuote.finalize();
      insertComment.finalize();

      koboDB.close();
      userDB.close(() => resolve(rows));
    });
  });
}

// Function to save Kobo data to this project's database
function saveKoboData(data) {
  const db = new Database('Kobo_utils_db.sqlite');
  db.serialize(() => {
    db.run('CREATE TABLE bookmarks (title TEXT, text TEXT, annotation TEXT)');

    const stmt = db.prepare('INSERT INTO bookmarks VALUES (?, ?, ?)');
    data.forEach(row => {
      stmt.run(row.title, row.text, row.annotation);
    });
    stmt.finalize();

    db.each('SELECT * FROM bookmarks', (err, row) => {
      console.log(row.title, row.text, row.annotation);
    });
  });

  db.close();
}

module.exports = { processKoboReaderFile, processKoboReaderFileSQL }; 