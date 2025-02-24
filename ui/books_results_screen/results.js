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

      quoteItem.addEventListener("click", () => {
          localStorage.setItem("selectedQuoteId", quote.id);
          window.location.href = "quote_details.html"; // Navigate to quote details page
      });

      resultsList.appendChild(quoteItem);
  });
});
