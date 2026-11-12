
import { useEffect, useState } from "react";
import {
    BookOpen,
    BookMarked,
    BookCheck,
    BookPlus
} from "lucide-react";

import { getBooks } from "../../services/bookService";
import { useAuth } from "../../context/AuthContext";

import styles from "./Dashboard.module.css";

function Dashboard() {
    const { user } = useAuth();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch books when the dashboard loads
    useEffect(() => {
        async function fetchBooks() {
            try {
                setLoading(true);
                setError("");

                const data = await getBooks();
                setBooks(data);
            } catch (err) {
                console.error("Error fetching books:", err);
                setError("Unable to load your books. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        fetchBooks();
    }, []);

    // Calculate reading statistics
    const totalBooks = books.length;

    const wantToRead = books.filter(
        (book) => book.status === "Want to Read"
    ).length;

    const currentlyReading = books.filter(
        (book) => book.status === "Currently Reading"
    ).length;

    const completed = books.filter(
        (book) => book.status === "Completed"
    ).length;

    // Get the five most recently added books
    const recentBooks = [...books]
        .sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        })
        .slice(0, 5);

    const statistics = [
        {
            label: "Total Books",
            value: totalBooks,
            icon: BookOpen
        },
        {
            label: "Want to Read",
            value: wantToRead,
            icon: BookPlus
        },
        {
            label: "Currently Reading",
            value: currentlyReading,
            icon: BookMarked
        },
        {
            label: "Completed",
            value: completed,
            icon: BookCheck
        }
    ];

    return (
        <div className={styles.dashboard}>

            {/* Welcome Section */}
            <section className={styles.welcomeSection}>
                <span className={styles.eyebrow}>
                    YOUR READING JOURNEY
                </span>

                <h2>
                    Welcome back, {user?.username || "Reader"}!
                </h2>

                <p>
                    Here's a little overview of your personal library.
                </p>
            </section>

            {/* Loading Message */}
            {loading && (
                <p className={styles.message}>
                    Loading your library...
                </p>
            )}

            {/* Error Message */}
            {error && (
                <p className={styles.errorMessage} role="alert">
                    {error}
                </p>
            )}

            {!loading && !error && (
                <>
                    {/* Statistics */}
                    <section className={styles.statsGrid}>
                        {statistics.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    className={styles.statCard}
                                    key={item.label}
                                >
                                    <div className={styles.statIcon}>
                                        <Icon size={22} />
                                    </div>

                                    <p>{item.label}</p>
                                    <h3>{item.value}</h3>
                                </div>
                            );
                        })}
                    </section>

                    {/* Recently Added Books */}
                    <section className={styles.recentSection}>
                        <div className={styles.sectionHeading}>
                            <div>
                                <span className={styles.eyebrow}>
                                    YOUR COLLECTION
                                </span>

                                <h3>Recently Added</h3>
                            </div>

                            <span className={styles.bookCount}>
                                {totalBooks} books
                            </span>
                        </div>

                        {recentBooks.length === 0 ? (
                            <div className={styles.emptyState}>
                                <BookOpen size={35} />

                                <h4>Your library is waiting</h4>

                                <p>
                                    Add your first book to start building
                                    your collection.
                                </p>
                            </div>
                        ) : (
                            <div className={styles.bookList}>
                                {recentBooks.map((book) => (
                                    <div
                                        className={styles.bookItem}
                                        key={book.id}
                                    >
                                        <div className={styles.bookIcon}>
                                            <BookOpen size={22} />
                                        </div>

                                        <div className={styles.bookInfo}>
                                            <h4>{book.title}</h4>
                                            <p>{book.author}</p>
                                        </div>

                                        <span className={styles.bookStatus}>
                                            {book.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}

        </div>
    );
}

export default Dashboard;
