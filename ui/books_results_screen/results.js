document.addEventListener("DOMContentLoaded", async () => {
    const resultsList = document.getElementById("results-list");
    const bookId = localStorage.getItem("selectedBook"); // Get the selected book from books.html

    if (!bookId) {
        alert("No book selected!");
        return;
    }

    const quotes = await window.electron.getQuotes(bookId);

    if (quotes.length === 0) {
        resultsList.innerHTML = "<p>No bookmarks found for this book.</p>";
        return;
    }

    quotes.forEach((quote) => {
        const quoteItem = document.createElement("div");
        quoteItem.classList.add("list-item");
        quoteItem.textContent = quote.text;

        // Tooltip Menu
        const tooltipMenu = document.createElement("div");
        tooltipMenu.classList.add("tooltip-menu");

        // Set Color Button
        const setColorBtn = document.createElement("button");
        setColorBtn.classList.add("set-color-btn");
        setColorBtn.textContent = "🎨 Set Color";
        setColorBtn.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent list item click event
            // const newColor = prompt("Enter color (red, blue, green, yellow, purple):");
            // if (newColor) {
            //     quoteItem.style.backgroundColor = newColor;
            //     // Save color to database if needed
            // }
        });

        // Add Comment Button
        const addCommentBtn = document.createElement("button");
        addCommentBtn.classList.add("add-comment-btn");
        addCommentBtn.textContent = "📝 Add Comment";
        addCommentBtn.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent list item click event
            // localStorage.setItem("selectedQuoteId", quote.id);
            // window.location.href = "quote_details.html"; // Navigate to quote details page
        });

        // Append buttons to tooltip menu
        tooltipMenu.appendChild(setColorBtn);
        tooltipMenu.appendChild(addCommentBtn);

        // Append tooltip menu to the quote item
        quoteItem.appendChild(tooltipMenu);

        quoteItem.addEventListener("click", () => {
            localStorage.setItem("selectedQuoteId", quote.id);
            window.location.href = "quote_details.html"; // Navigate to quote details page
        });

        resultsList.appendChild(quoteItem);
    });

    document.getElementById('export-md').addEventListener('click', () => {
        exportToMarkdown(quotes);
    });
});

function groupAnnotations(data) {
    const groupedAnnotations = {};

    data.forEach(({ book_id, id, text }) => {
        const cleanTitle = book_id; // Remove invalid filename characters
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

    Object.entries(groupedAnnotations).forEach(([book_id, texts]) => {
        markdownContent += `# ${book_id}\n\n${texts.join('\n\n')}\n\n`;
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
