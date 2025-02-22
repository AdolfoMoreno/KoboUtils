const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectSQLiteFile: () => ipcRenderer.invoke('select-sqlite'),
  selectKoboPath: () => ipcRenderer.invoke('select-kobo'),
  openHelp: () => ipcRenderer.invoke('help-button')
});