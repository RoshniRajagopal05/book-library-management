
import api from "./api";

// Fetch all books belonging to the logged-in user
export const getBooks = async () => {
    const response = await api.get("/api/books/");
    return response.data;
};
