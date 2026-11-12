
import { useEffect, useState } from "react";
import Notification from "../common/Notification";

import {
    BookOpen,
    Search,
    Library as LibraryIcon
} from "lucide-react";

import {
    getBooks,
    updateBookStatus
} from "../../services/bookService";

import styles from "./Library.module.css";

function Library() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");

    const [updatingBookId, setUpdatingBookId] = useState(null);

    const [notification, setNotification] = useState({
        type: "success",
        message: ""
    });

    // Fetch books from backend
    useEffect(() => {
        async function fetchBooks() {
            try {
                setLoading(true);
                setError("");

                const data = await getBooks();
                setBooks(data);

            } catch (err) {
                console.error("Error fetching books:", err);

                if (err.response?.status === 401) {
                    setError("Your session has expired. Please log in again.");
                } else if (!err.response) {
                    setError("Unable to connect to the server.");
                } else {
                    setError("Unable to load your books. Please try again.");
                }

            } finally {
                setLoading(false);
            }
        }

        fetchBooks();
    }, []);

    // Update book reading status
    async function handleStatusChange(bookId, newStatus) {
        setUpdatingBookId(bookId);

        setNotification({
            type: "success",
            message: ""
        });

        try {
            const updatedBook = await updateBookStatus(bookId, newStatus);

            // Update the book in React state
            setBooks((previousBooks) =>
                previousBooks.map((book) =>
                    book.id === bookId
                        ? updatedBook
                        : book
                )
            );

            setNotification({
                type: "success",
                message: "Reading status updated successfully!"
            });

        } catch (err) {
            console.error("Error updating book status:", err);

            let errorMessage = "Unable to update reading status. Please try again.";

            if (err.response?.status === 401) {
                errorMessage = "Your session has expired. Please log in again.";
            } else if (err.response?.status === 404) {
                errorMessage = "Book not found.";
            } else if (!err.response) {
                errorMessage = "Unable to connect to the server.";
            }

            setNotification({
                type: "error",
                message: errorMessage
            });

        } finally {
            setUpdatingBookId(null);
        }
    }

    // Search and filter books
    const filteredBooks = books.filter((book) => {

        const matchesSearch =
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            selectedStatus === "All" ||
            book.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className={styles.libraryPage}>

          

            {/* Notification */}
            <Notification
                type={notification.type}
                message={notification.message}
                onClose={() =>
                    setNotification({
                        type: "success",
                        message: ""
                    })
                }
            />

            {/* Search and Filter */}
            <section className={styles.toolbar}>

                <div className={styles.searchBox}>
                    <Search size={19} />

                    <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                    />
                </div>

                <select
                    className={styles.statusFilter}
                    value={selectedStatus}
                    onChange={(event) =>
                        setSelectedStatus(event.target.value)
                    }
                >
                    <option value="All">All Books</option>
                    <option value="Want to Read">Want to Read</option>
                    <option value="Currently Reading">Currently Reading</option>
                    <option value="Completed">Completed</option>
                </select>

            </section>

            {/* Book Count */}
            {!loading && !error && (
                <div className={styles.resultsInfo}>
                    <span>
                        Showing {filteredBooks.length} of {books.length} books
                    </span>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <p className={styles.message}>
                    Loading your library...
                </p>
            )}

            {/* Error */}
            {error && (
                <p className={styles.errorMessage} role="alert">
                    {error}
                </p>
            )}

            {/* Book Collection */}
            {!loading && !error && (
                <>
                    {filteredBooks.length === 0 ? (

                        <div className={styles.emptyState}>
                            <LibraryIcon size={42} />

                            <h3>
                                {books.length === 0
                                    ? "Your library is empty"
                                    : "No books found"}
                            </h3>

                            <p>
                                {books.length === 0
                                    ? "Add your first book to start building your collection."
                                    : "Try another search term or reading status."}
                            </p>
                        </div>

                    ) : (

                        <section className={styles.bookGrid}>

                            {filteredBooks.map((book) => (

                                <article
                                    className={styles.bookCard}
                                    key={book.id}
                                >

                                    <div className={styles.bookCover}>
                                        <BookOpen size={35} />
                                    </div>

                                    <div className={styles.bookDetails}>

                                        <h3>{book.title}</h3>

                                        <p className={styles.author}>
                                            By {book.author}
                                        </p>

                                        <span
                                            className={`${styles.statusBadge} ${
                                                book.status === "Completed"
                                                    ? styles.completed
                                                    : book.status === "Currently Reading"
                                                    ? styles.reading
                                                    : styles.want
                                            }`}
                                        >
                                            {book.status}
                                        </span>

                                        {/* Update Reading Status */}
                                        <div className={styles.statusUpdate}>
                                            <label htmlFor={`status-${book.id}`}>
                                                Change status
                                            </label>

                                            <select
                                                id={`status-${book.id}`}
                                                value={book.status}
                                                disabled={updatingBookId === book.id}
                                                onChange={(event) =>
                                                    handleStatusChange(
                                                        book.id,
                                                        event.target.value
                                                    )
                                                }
                                            >
                                                <option value="Want to Read">
                                                    Want to Read
                                                </option>

                                                <option value="Currently Reading">
                                                    Currently Reading
                                                </option>

                                                <option value="Completed">
                                                    Completed
                                                </option>
                                            </select>

                                            {updatingBookId === book.id && (
                                                <span className={styles.updatingMessage}>
                                                    Updating...
                                                </span>
                                            )}
                                        </div>

                                    </div>

                                </article>

                            ))}

                        </section>

                    )}
                </>
            )}

        </div>
    );
}

export default Library;
