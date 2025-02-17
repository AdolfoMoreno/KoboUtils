export function renderTable(data) {
    const tableContainer = document.getElementById('table-container');
    let tableHTML = `<table>  
        <tr>  
          <th>Book</th>  
          <th>Chapter</th>  
          <th>Note</th>  
        </tr>`;
    data.forEach(item => {
        tableHTML += `<tr>  
          <td>${item.book}</td>  
          <td>${item.chapter}</td>  
          <td>${item.note}</td>  
        </tr>`;
    });
    tableHTML += `</table>`;
    tableContainer.innerHTML = tableHTML;
}  