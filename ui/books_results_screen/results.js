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
});
