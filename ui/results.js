document.addEventListener('DOMContentLoaded', () => {
    const annotations = JSON.parse(localStorage.getItem('annotations')) || [];
    const tableBody = document.getElementById('annotations-table');
  
    annotations.forEach(({ title, text }) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${title}</td><td>${text}</td>`;
      tableBody.appendChild(row);
    });
  });
  