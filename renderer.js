import { renderTable } from './ui/tableRenderer.js';

document.getElementById('select-dir').addEventListener('click', async () => {
    const response = await window.electronAPI.selectKoboDirectory();
    if (response.error) {
        alert('Error: ' + response.error);
    } else {
        renderTable(response.annotations);
    }
}); 