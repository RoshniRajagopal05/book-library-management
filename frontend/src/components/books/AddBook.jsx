
import { useState } from "react";
import Notification from "../common/Notification";
import { BookOpen } from "lucide-react";

import { createBook } from "../../services/bookService";

import styles from "./AddBook.module.css";

function AddBook({ onBookAdded }) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [status, setStatus] = useState("Want to Read");

    const [loading, setLoading] = useState(false);

    const [notification, setNotification] = useState({
        type: "success",
        message: ""
    });

    async function handleSubmit(event) {
        event.preventDefault();

        setNotification({
            type: "success",
            message: ""
        });

        try {
            setLoading(true);

            const bookData = {
                title,
                author,
                status
            };

            await createBook(bookData);

            setNotification({
                type: "success",
                message: "Book added successfully!"
            });

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

            let errorMessage = "Unable to add book. Please try again.";

            if (err.response?.status === 401) {
                errorMessage = "Your session has expired. Please log in again.";
            } else if (err.response?.data?.detail) {
                errorMessage =
                    typeof err.response.data.detail === "string"
                        ? err.response.data.detail
                        : "Please check the book details.";
            } else if (!err.response) {
                errorMessage = "Unable to connect to the server.";
            }

            setNotification({
                type: "error",
                message: errorMessage
            });

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
