
import { useState } from "react";
import { BookOpen, CheckCircle } from "lucide-react";

import { createBook } from "../../services/bookService";

import styles from "./AddBook.module.css";

function AddBook({ onBookAdded }) {

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [status, setStatus] = useState("Want to Read");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        try {
            setLoading(true);

            const bookData = {
                title,
                author,
                status
            };

            await createBook(bookData);

            setSuccess("Book added successfully!");

            // Clear form fields
            setTitle("");
            setAuthor("");
            setStatus("Want to Read");

            // Notify parent component
            if (onBookAdded) {
                onBookAdded();
            }

        } catch (err) {
            console.error("Error adding book:", err);

            if (err.response?.status === 401) {
                setError("Your session has expired. Please log in again.");
            } else if (err.response?.data?.detail) {
                setError(
                    typeof err.response.data.detail === "string"
                        ? err.response.data.detail
                        : "Please check the book details."
                );
            } else if (!err.response) {
                setError("Unable to connect to the server.");
            } else {
                setError("Unable to add book. Please try again.");
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.addBookPage}>

            {/* Heading */}
            <section className={styles.pageHeading}>
                <span className={styles.eyebrow}>
                    GROW YOUR COLLECTION
                </span>

                <h2>Add a Book</h2>

                <p>
                    Every great reading journey starts with a book.
                </p>
            </section>

            {/* Form Card */}
            <section className={styles.formCard}>

                <div className={styles.formIcon}>
                    <BookOpen size={25} />
                </div>

                <h3>Book Details</h3>

                <p className={styles.formDescription}>
                    Enter the details of the book you want to add.
                </p>

                <form onSubmit={handleSubmit}>

                    {/* Book Title */}
                    <div className={styles.formGroup}>
                        <label htmlFor="bookTitle">
                            Book Title
                        </label>

                        <input
                            id="bookTitle"
                            type="text"
                            placeholder="Enter book title"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            maxLength={200}
                            required
                        />
                    </div>

                    {/* Author */}
                    <div className={styles.formGroup}>
                        <label htmlFor="bookAuthor">
                            Author
                        </label>

                        <input
                            id="bookAuthor"
                            type="text"
                            placeholder="Enter author's name"
                            value={author}
                            onChange={(event) =>
                                setAuthor(event.target.value)
                            }
                            maxLength={150}
                            required
                        />
                    </div>

                    {/* Reading Status */}
                    <div className={styles.formGroup}>
                        <label htmlFor="bookStatus">
                            Reading Status
                        </label>

                        <select
                            id="bookStatus"
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value)
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
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className={styles.successMessage}>
                            <CheckCircle size={18} />
                            <span>{success}</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <p
                            className={styles.errorMessage}
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? "Adding Book..." : "Add Book"}
                    </button>

                </form>
            </section>

        </div>
    );
}

export default AddBook;
