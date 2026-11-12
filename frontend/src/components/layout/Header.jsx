
import styles from "./Header.module.css";

function Header({ activePage }) {

    const pageDetails = {
        dashboard: {
            title: "Your reading space",
            subtitle: "A little space for the stories you love."
        },
        library: {
            title: "My Library",
            subtitle: "All your books, together in one place."
        },
        "add-book": {
            title: "Add a Book",
            subtitle: "Make room for another great read."
        }
    };

    const currentPage = pageDetails[activePage];

    return (
        <header className={styles.header}>

            <div>
                <span className={styles.eyebrow}>
                    YOUR PERSONAL LIBRARY
                </span>

                <h1>{currentPage.title}</h1>

                <p>{currentPage.subtitle}</p>
            </div>

            <div className={styles.userBadge}>
                <div className={styles.avatar}>R</div>

                <span>Reader</span>
            </div>

        </header>
    );
}

export default Header;
