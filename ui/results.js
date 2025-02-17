document.addEventListener('DOMContentLoaded', () => {
  const annotations = JSON.parse(localStorage.getItem('annotations')) || [];
  const tableBody = document.getElementById('annotations-table');

  annotations.forEach(({ title, text }) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${title}</td><td>${text}</td>`;
    tableBody.appendChild(row);
  });

  document.getElementById('export-md').addEventListener('click', () => {
    const exportSeparate = document.getElementById('export-separate').checked;
    
    if (exportSeparate) {
      localStorage.setItem('groupedAnnotations', JSON.stringify(groupAnnotations(annotations)));
      window.location.href = 'export.html'; // Redirect to new screen
    } else {
      exportToMarkdown(annotations);
    }
  });
});

function groupAnnotations(data) {
  const groupedAnnotations = {};
  
  data.forEach(({ title, text }) => {
    const cleanTitle = title.trim().replace(/[<>:"/\\|?*]/g, ""); // Remove invalid filename characters
    const cleanText = text.replace(/\s+/g, ' ').trim(); // Normalize spaces

    if (!groupedAnnotations[cleanTitle]) {
      groupedAnnotations[cleanTitle] = [];
    }
    groupedAnnotations[cleanTitle].push(`> ${cleanText}`);
  });

  return groupedAnnotations;
}

function exportToMarkdown(data) {
  let markdownContent = "";
  const groupedAnnotations = groupAnnotations(data);

  Object.entries(groupedAnnotations).forEach(([title, texts]) => {
    markdownContent += `# ${title}\n\n${texts.join('\n\n')}\n\n`;
  });

  saveMarkdownFile(markdownContent, "annotations.md");
}

function saveMarkdownFile(content, filename) {
  const blob = new Blob([content], { type: "text/markdown" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
