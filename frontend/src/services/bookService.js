
import api from "./api";

// Fetch all books belonging to the logged-in user
export const getBooks = async () => {
    const response = await api.get("/api/books/");
    return response.data;
};

// Create a new book
export const createBook = async (bookData) => {
    const response = await api.post("/api/books/", bookData);
    return response.data;
};

// Update the reading status of a book
export const updateBookStatus = async (bookId, status) => {
    const response = await api.patch(
        `/api/books/${bookId}/status`,
        { status }
    );

    return response.data;
};
