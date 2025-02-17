document.addEventListener('DOMContentLoaded', () => {
    const annotations = JSON.parse(localStorage.getItem('annotations')) || [];
    const tableBody = document.getElementById('annotations-table');
  
    annotations.forEach(({ title, text }) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${title}</td><td>${text}</td>`;
      tableBody.appendChild(row);
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const annotations = JSON.parse(localStorage.getItem('annotations')) || [];
    const tableBody = document.getElementById('annotations-table');
  
    annotations.forEach(({ title, text }) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${title}</td><td>${text}</td>`;
      tableBody.appendChild(row);
    });
  
    document.getElementById('export-md').addEventListener('click', () => {
      exportToMarkdown(annotations);
    });
  });
  
  function exportToMarkdown(data) {
    let markdownContent = "";
    const groupedAnnotations = {};
  
    // Group annotations by book title
    data.forEach(({ title, text }) => {
      if (!groupedAnnotations[title]) {
        groupedAnnotations[title] = [];
      }
      groupedAnnotations[title].push(`> ${text}`);
    });
  
    // Build Markdown content
    for (const [title, texts] of Object.entries(groupedAnnotations)) {
      markdownContent += `# ${title}\n\n${texts.join('\n\n')}\n\n`;
    }
  
    // Save as Markdown file
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "annotations.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  