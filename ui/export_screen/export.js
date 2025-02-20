document.addEventListener('DOMContentLoaded', () => {
    const groupedAnnotations = JSON.parse(localStorage.getItem('groupedAnnotations')) || {};
    const exportTable = document.getElementById('export-table');
  
    Object.keys(groupedAnnotations).forEach((title) => {
      const row = document.createElement('tr');
  
      row.innerHTML = `
        <td>${title}</td>
        <td><button class="download-btn" onclick="downloadMarkdown('${title}')">Download</button></td>
      `;
  
      exportTable.appendChild(row);
    });
  });
  
  function downloadMarkdown(title) {
    const groupedAnnotations = JSON.parse(localStorage.getItem('groupedAnnotations')) || {};
    const markdownContent = `# ${title}\n\n${groupedAnnotations[title].join('\n\n')}\n\n`;
    
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  