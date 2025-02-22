const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectSQLiteFile: () => ipcRenderer.invoke('select-sqlite'),
  selectKoboPath: () => ipcRenderer.invoke('select-kobo'),
  openHelp: () => ipcRenderer.invoke('help-button'),
});