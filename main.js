const { app, BrowserWindow, dialog, ipcMain } = require('electron');  
const path = require('path');  
const { readAnnotations } = require('./modules/annotationReader'); 

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });
    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

ipcMain.handle('select-kobo-directory', async () => {
    try {
        const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
        if (result.canceled) {
            return { error: 'No directory selected' };
        }
        const koboDir = result.filePaths[0];
        const annotations = await readAnnotations(koboDir);
        return { annotations };
    } catch (error) {
        console.error('Error in main process:', error);
        return { error: error.message };
    }
});  