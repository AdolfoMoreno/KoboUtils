import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    selectKoboDirectory: () => ipcRenderer.invoke('select-kobo-directory')
});  