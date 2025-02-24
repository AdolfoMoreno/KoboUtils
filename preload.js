const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  selectKoboPath: () => ipcRenderer.invoke('select-kobo'),
  getBooks: () => ipcRenderer.invoke('get-books'),
  getQuotes: (bookId) => ipcRenderer.invoke("get-quotes", bookId),
  openHelp: () => ipcRenderer.invoke('help-button'),
});