const { ipcMain } = require('electron');
const sqlite3 = require('sqlite3').verbose();

ipcMain.handle('get-books', async () => {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database('kobo_utils_db.sqlite', sqlite3.OPEN_READONLY);
      
      db.all(`SELECT id, title FROM books`, [], (err, rows) => {
        if (err) {
          console.error('Error fetching books:', err);
          reject(err);
        } else {
          resolve(rows);
        }
        db.close();
      });
    });
  });