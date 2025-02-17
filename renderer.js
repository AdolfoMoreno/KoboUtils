document.getElementById('select-folder').addEventListener('click', async () => {
    const data = await window.electron.selectFolder();
  
    if (data.length > 0) {
      localStorage.setItem('annotations', JSON.stringify(data));
      window.location.href = 'ui/results.html'; // Navigate to results page
    } else {
      alert('No annotations found or action was cancelled.');
    }
  });
  