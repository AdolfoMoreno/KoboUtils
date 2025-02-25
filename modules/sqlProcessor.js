const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { formatBookName } = require('./utils');

function processKoboReaderFileSQL(directory) {
  const userDBPath = path.join(__dirname, '..', 'kobo_utils_db.sqlite');

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
        Bookmark.Text AS text
      FROM Bookmark
      WHERE Bookmark.Text IS NOT NULL
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
        text: row.text ? row.text.trim() : ''
      }));

      const insertBook = userDB.prepare(`INSERT INTO books (title) VALUES (?) ON CONFLICT(title) DO NOTHING`);
      const insertQuote = userDB.prepare(`INSERT INTO quotes (book_id, text, color) VALUES (?, ?, NULL)`);

      let pendingQueries = rows.length;

      rows.forEach(({ bookTitle, text }) => {
        const formattedBookTitle = formatBookName(bookTitle);
        insertBook.run(formattedBookTitle, function () {
          userDB.get(`SELECT id FROM books WHERE title = ?`, [formattedBookTitle], (err, book) => {
            if (book) {
              insertQuote.run(book.id, text, function () {
                pendingQueries--;

                // Finalize when all inserts are done
                if (pendingQueries === 0) {
                  insertBook.finalize();
                  insertQuote.finalize();
                  koboDB.close();
                  userDB.close(() => resolve(rows));
                }
              });
            }
          });
        });
      });

      // If there are no rows, finalize immediately
      if (rows.length === 0) {
        insertBook.finalize();
        insertQuote.finalize();
        koboDB.close();
        userDB.close(() => resolve([]));
      }
    });
  });
}

function getQuotesByBook(bookId) {
  return new Promise((resolve, reject) => {
      const dbPath = path.join(__dirname, '..', 'kobo_utils_db.sqlite');
      const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
      db.all(`SELECT book_id, id, text FROM quotes WHERE book_id = ?`, [bookId], (err, rows) => {
          if (err) {
              console.error("Error fetching quotes:", err);
              reject(err);
          } else {
              resolve(rows);
          }
          db.close();
      });
  });
}

module.exports = { processKoboReaderFileSQL, getQuotesByBook }; 