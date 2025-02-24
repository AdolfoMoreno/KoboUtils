document.getElementById('select-folder').addEventListener('click', async () => {
  const data = await window.electron.selectFolder();

  if (data.length > 0) {
    localStorage.setItem('annotations', JSON.stringify(data));
    window.location.href = 'ui/results_screen/results.html'; // Navigate to results page
  } else {
    alert('No annotations found or action was cancelled.');
  }
});

document.getElementById('select-sqlite').addEventListener('click', async () => {
  const data = await window.electron.selectSQLiteFile();

  console.log(data);

  if (data.length > 0) {
    localStorage.setItem('sql_annotations', JSON.stringify(data));
    window.location.href = 'ui/results_screen/results.html'; // Navigate to results page
  } else {
    alert('No annotations found or action was cancelled.');
  }
});

document.getElementById('select-kobo').addEventListener('click', async () => {
  const data = await window.electron.selectKoboPath();

  if (data.length > 0) {
    localStorage.setItem('sql_annotations', JSON.stringify(data));
    window.location.href = 'ui/results_screen/results.html'; // Navigate to results page
  } else {
    alert('No annotations found or action was cancelled.');
  }
});

document.getElementById('view-bookmarks').addEventListener('click', () => {
  window.location.href = 'ui/books_screen/books.html'; // Redirect to book selection page
});

document.getElementById('help-button').addEventListener('click', async () => {
  alert('Not yet implemented'); // Navigate to help page
});
