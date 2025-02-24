document.addEventListener('DOMContentLoaded', async () => {
    const books = await window.electron.getBooks(); // Fetch books from SQLite

    const bookListContainer = document.getElementById('book-list');
    bookListContainer.innerHTML = '';

    if (books.length === 0) {
        bookListContainer.innerHTML = '<p>No books found.</p>';
        return;
    }

    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        bookItem.textContent = book.title;

        bookItem.addEventListener('click', () => {
            localStorage.setItem('selectedBook', book.title); // Store selected book
            window.location.href = '../results_screen/results.html'; // Navigate to results
        });

        bookListContainer.appendChild(bookItem);
    });
});

// Back button navigation
document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = '../../index.html'; // Back to index
});
