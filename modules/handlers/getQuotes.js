const { ipcMain } = require("electron");
const { getQuotesByBook } = require("../sqlProcessor");

ipcMain.handle("get-quotes", async (event, bookId) => {
    try {
        return await getQuotesByBook(bookId);
    } catch (error) {
        console.error("Error fetching quotes:", error);
        return [];
    }
});
